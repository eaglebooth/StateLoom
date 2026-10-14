# Verification status

Contract v1.2: 35 finalized SDK transactions and 52 passing assertions across the
primary lifecycle and adversarial supplement.
Source parity: verified byte-for-byte via gen_getContractCode; see SOURCE_PARITY.json.

Frontend consistency checks after live testing:
- Votes objects are no longer spread as receipt arrays.
- Successful leader execution is required after FINALIZED.
- Baseline, consent, assessment and activation require action-specific post-state checks.
- Epoch and short values are displayed without address truncation.

Submission verification model (the same model used by accepted ForkLens V4):
- Live writes are signed through `genlayer-js` by two non-deployer wallets.
- Every write records caller, exact arguments, finality, execution result and the
  relevant authoritative before/after readback.
- Expected-error controls require exact equality of the affected object.
- Live digest controls prove both entry-time rejection of the wrong active-record
  digest and fail-closed `UNRESOLVED` handling when fetched candidate bytes do not
  match the transaction-bound digest.
- A capability copied from another lineage is rejected with exact study-state
  equality; the study's own bound capability remains usable.
- Browser-extension signing is not part of this evidence model and is not required
  to establish the live contract result. The frontend remains available for a judge
  to repeat the workflow using their own wallets.

Scope limitation: the positive live fixture has an identical normalized storage
layout. It validates the safe/activation path but is not evidence of a newly appended
field or whole-program runtime semantic equivalence. The submission must describe the
project as a storage-layout lineage gate, not as a formal audit or proof of runtime
safety.

The malicious-leader control is necessarily local: a caller cannot choose or force a
malicious StudioNet leader. The validator regression passes a tampered leader finding
through the same binding validator and confirms rejection. It is not represented as a
fabricated live transaction.
