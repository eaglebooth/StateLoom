# StateLoom

Live application: https://stateloom.vercel.app

StateLoom is a GenLayer dApp for consensus-gated storage lineage. It compares the
verified layouts of two deployed EVM implementations, blocks structural collisions,
uses bounded validator-reviewed intelligence to detect semantic repurposing, and
advances its own canonical implementation registry only for `SAFE_APPEND` studies.

It does **not** upgrade an external proxy or claim audit/formal-verification status.

Current StudioNet deployment: [`0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd`](https://explorer-studio.genlayer.com/address/0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd).
Finalized-state readback confirms `stateloom/1.2.0`. Byte-for-byte source readback is
recorded in [`docs/SOURCE_PARITY.json`](docs/SOURCE_PARITY.json). The superseded v1.0
and v1.1 deployments are listed in [`deployments/studionet.json`](deployments/studionet.json).
The finalized deployment transaction is [`0xe2ebb61dc7b83ce00dbb549108607e896f2c321654db732c1ea376993218868f`](https://explorer-studio.genlayer.com/tx/0xe2ebb61dc7b83ce00dbb549108607e896f2c321654db732c1ea376993218868f).

## Roles

- The deploying wallet deploys only and receives no protocol role.
- Any wallet can create a lineage and becomes that lineage's owner.
- The owner chooses a distinct guardian wallet.
- Either participant may open/assess a candidate; only the owner consumes a safe
  single-use capability.
- A reviewer can use their own two wallets and public fixture addresses.

## Verification

```bash
python -m pytest -q -p no:cacheprovider
python -X utf8 -m genvm_linter.cli check contracts/state_loom.py
npm run lint
npm run build
```

Local mocks exercise contract invariants only; they are not submission evidence. The
submission-grade two-wallet run is indexed in
[`docs/LIVE_STUDIONET_EVIDENCE.md`](docs/LIVE_STUDIONET_EVIDENCE.md): 35 finalized
transactions across the lifecycle and adversarial runs, 52 passing assertions and
zero failed assertions. Each write records
the caller, exact arguments, expected/actual execution and authoritative before/after
readback. The frontend waits for `FINALIZED`, rejects execution errors and verifies
the relevant contract readback before displaying success.

## Evidence map

- [Resource manifest](docs/TEST_RESOURCE_MANIFEST.md)
- [Negative/adversarial controls](docs/TEST_CONTROL_MANIFEST.md)
- [Live StudioNet evidence](docs/LIVE_STUDIONET_EVIDENCE.md)
- [Machine-readable live run](docs/live-evidence/studionet-942217300.json)
- [Machine-readable adversarial supplement](docs/live-evidence/studionet-adversarial-942217400.json)
- [Deployed-source parity](docs/SOURCE_PARITY.json)
- `docs/schema.json` and `docs/local-evidence/` are generated verification artifacts.

## Source limitation

Sourcify provenance proves that the compared compiler metadata belongs to an exact
chain/address and matches the transaction-bound response digest. It does not prove
runtime semantic equivalence. The positive live fixture has an identical normalized
layout; it is not evidence of an appended field or a whole-program audit. Missing or
ambiguous layout resolves to `UNRESOLVED` and is never inferred from README prose.
