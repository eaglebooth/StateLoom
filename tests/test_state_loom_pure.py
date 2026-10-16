import importlib.util
import json
import pathlib
import sys
import types
import pytest

class DummyContract: pass
class DummyUserError(Exception): pass
class DummyBigInt(int): pass
class DummyDecorator:
    def __call__(self, fn): return fn
dummy_gl=types.SimpleNamespace(Contract=DummyContract,public=types.SimpleNamespace(write=DummyDecorator(),view=DummyDecorator()),vm=types.SimpleNamespace(UserError=DummyUserError))
fake=types.ModuleType("genlayer")
fake.gl=dummy_gl; fake.allow_storage=lambda x:x; fake.TreeMap=dict; fake.bigint=DummyBigInt
fake.__all__=["gl","allow_storage","TreeMap","bigint"]
sys.modules.setdefault("genlayer",fake)
path=pathlib.Path(__file__).parents[1]/"contracts"/"state_loom.py"
spec=importlib.util.spec_from_file_location("state_loom",path); mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

def response(address, rows):
    types_map={r["type"]:{"encoding":r.get("encoding","inplace"),"label":r.get("type_label",r["type"]),"numberOfBytes":str(r.get("width",32))} for r in rows}
    storage=[{"slot":str(r["slot"]),"offset":r.get("offset",0),"type":r["type"],"label":r["label"],"contract":"Vault"} for r in rows]
    return json.dumps({"chainId":"11155111","address":address,"match":{"runtimeMatch":"perfect"},"compilation":{"storageLayout":{"storage":storage,"types":types_map}}}).encode()

A="0x"+"1"*40
BASE=[{"slot":0,"type":"t_address","type_label":"address","width":20,"label":"owner"},{"slot":1,"type":"t_uint256","type_label":"uint256","label":"balance"}]

def test_parse_binds_chain_address_and_layout():
    parsed=mod.parse_sourcify(response(A,BASE),11155111,A)
    assert parsed["address"]==A and parsed["layout"][0]["label"]=="owner"

def test_wrong_address_rejected():
    try: mod.parse_sourcify(response(A,BASE),11155111,"0x"+"2"*40)
    except ValueError as exc: assert str(exc)=="SOURCE_IDENTITY"
    else: raise AssertionError("wrong address accepted")

def test_append_only_is_structurally_safe():
    old=mod.parse_sourcify(response(A,BASE),11155111,A)["layout"]
    new=mod.parse_sourcify(response(A,BASE+[{"slot":2,"type":"t_bool","type_label":"bool","width":1,"label":"paused"}]),11155111,A)["layout"]
    verdict,rows=mod.structural_findings(old,new)
    assert verdict=="STRUCTURALLY_SAFE" and len(rows)==2

def test_type_change_is_conflict():
    old=mod.parse_sourcify(response(A,BASE),11155111,A)["layout"]
    changed=[dict(BASE[0]),dict(BASE[1])]; changed[1].update(type="t_address",type_label="address",width=20)
    new=mod.parse_sourcify(response(A,changed),11155111,A)["layout"]
    verdict,rows=mod.structural_findings(old,new)
    assert verdict=="STRUCTURAL_CONFLICT" and rows[1]["relation"]=="STRUCTURAL_CONFLICT"

def test_semantic_vector_requires_every_slot():
    pending=[{"slot":0,"offset":0,"old_label":"owner","new_label":"owner","old_type":"address","new_type":"address","relation":"PENDING"}]
    assert not mod.parse_relations({"findings":[]},pending)
    good={"findings":[{"slot":0,"offset":0,"relation":"PRESERVED_MEANING","evidence":"owner remains the authorization principal"}]}
    assert mod.parse_relations(good,pending)[0]["relation"]=="PRESERVED_MEANING"

def test_duplicate_positions_rejected():
    bad=BASE+[dict(BASE[0])]
    try: mod.parse_sourcify(response(A,bad),11155111,A)
    except ValueError as exc: assert str(exc)=="LAYOUT_DUPLICATE"
    else: raise AssertionError("duplicate accepted")

def test_identical_layout_has_deterministic_preservation():
    layout=mod.parse_sourcify(response(A,BASE),11155111,A)["layout"]
    verdict,pending=mod.structural_findings(layout,layout)
    findings=mod.identical_layout_findings(layout,layout,pending)
    assert verdict=="STRUCTURALLY_SAFE"
    assert findings and all(x["relation"]=="PRESERVED_MEANING" for x in findings)

def test_renamed_layout_still_requires_semantic_consensus():
    old=mod.parse_sourcify(response(A,BASE),11155111,A)["layout"]
    renamed=[dict(BASE[0]),dict(BASE[1])]; renamed[0]["label"]="fee_recipient"
    new=mod.parse_sourcify(response(A,renamed),11155111,A)["layout"]
    _,pending=mod.structural_findings(old,new)
    assert mod.identical_layout_findings(old,new,pending)==[]

def test_validator_accepts_bound_leader_findings_and_rejects_tampering():
    layout=mod.parse_sourcify(response(A,BASE),11155111,A)["layout"]
    _,pending=mod.structural_findings(layout,layout)
    leader=mod.identical_layout_findings(layout,layout,pending)
    assert mod.validate_bound_findings(leader,pending)==leader
    altered=[dict(row) for row in leader]
    altered[0]["old_label"]="attacker_supplied"
    assert mod.validate_bound_findings(altered,pending)==[]


@pytest.mark.parametrize("participant", ["owner", "guardian"])
def test_third_party_cannot_finalize_or_block_later_participant_assessment(monkeypatch, participant):
    owner, guardian, outsider = ("0x" + c * 40 for c in ("a", "b", "c"))
    candidate = "0x" + "d" * 40
    contract = mod.StateLoom()
    contract.lineages, contract.studies = {}, {}
    message = types.SimpleNamespace(sender_address=owner)
    monkeypatch.setattr(dummy_gl, "message", message, raising=False)
    lineage_id = contract.create_lineage("authorization", guardian, 11155111)
    old_digest, new_digest = "1" * 64, "2" * 64
    contract.propose_baseline(lineage_id, A, old_digest)
    message.sender_address = guardian
    contract.accept_baseline(lineage_id, contract.lineages[lineage_id].consent_digest)
    study_id = contract.open_study(lineage_id, candidate, 1)
    before = (contract.get_lineage(lineage_id), contract.get_study(study_id))
    calls = []
    def consensus(leader, validator):
        calls.append(True)
        return mod.canonical({"old": {}, "new": {}, "structural": "STRUCTURALLY_SAFE",
                              "findings": [{"slot": 0, "offset": 0, "relation": "PRESERVED_MEANING"}]})
    monkeypatch.setattr(dummy_gl.vm, "run_nondet_unsafe", consensus, raising=False)
    message.sender_address = outsider
    with pytest.raises(DummyUserError, match="PARTICIPANT_ONLY"):
        contract.assess_study(study_id, old_digest, "f" * 64)
    assert calls == []
    assert (contract.get_lineage(lineage_id), contract.get_study(study_id)) == before
    message.sender_address = owner if participant == "owner" else guardian
    assert contract.assess_study(study_id, old_digest, new_digest) == "SAFE_APPEND"
    assert len(calls) == 1
    result = json.loads(contract.get_study(study_id))
    assert result["status"] == "ASSESSED" and result["capability_digest"]
    assert result["new_record_digest"] == new_digest
