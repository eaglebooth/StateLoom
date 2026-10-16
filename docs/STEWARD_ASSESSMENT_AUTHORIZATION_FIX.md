# Assessment authorization correction — 1.2.1

The steward reported that an unrelated account could assess an open study with an
incorrect candidate digest, finalize it without a capability, and prevent a later
participant assessment for the same lineage, epoch and candidate.

## Correction

`assess_study` now verifies the transaction sender against the lineage owner and
guardian before checking assessment inputs, invoking consensus or mutating state.
Other senders receive `PARTICIPANT_ONLY`. The contract version is `stateloom/1.2.1`.
Both existing participants retain the ability to assess an open study.

## Repository regression evidence

`tests/test_state_loom_pure.py` contains the parameterized test
`test_third_party_cannot_finalize_or_block_later_participant_assessment`.
It creates a lineage and open study through the public entrypoints, then:

1. Attempts assessment as an outsider with a different candidate digest.
2. Requires `PARTICIPANT_ONLY` before the consensus callback is invoked.
3. Compares exact serialized lineage and study state before and after rejection.
4. Assesses the same study as its owner, and separately as its guardian.
5. Requires `SAFE_APPEND`, an assessed study and a nonempty capability.

Before the correction, both parameterized cases failed because no authorization
error was raised. After the correction, all 11 tests passed. GenVM lint and schema
validation also passed. The consensus result in this regression is a controlled stub;
this is local authorization/state-transition evidence, not live source consensus.

## Deployment status

Verified replacement contract:
`0x636e8A70a9aB4E4079D12E992c26e7EE8C613fe9`.
Latest-final version returned `stateloom/1.2.1`. RPC `getContractCode` returned
22,395 bytes identical to the local source, SHA-256
`72f59362be79bca6330ba20d39d903605c7a18ec3203e3fc77a0fe0b92240b7b`.
Live authorization verification on this replacement deployment:

- [Outsider with wrong candidate digest](https://explorer-studio.genlayer.com/tx/0x80dafa9cd3f428533e12a6a3d82815be0076022ea638d41b30cbaa374d355ce4): FINALIZED / ERROR.
- [Outsider with correct digests](https://explorer-studio.genlayer.com/tx/0xd97a17712afba82bb46795816429cc52d0832baa719b8f5ffabb18e59e749ac7): FINALIZED / ERROR.
- [Guardian assesses the same study afterward](https://explorer-studio.genlayer.com/tx/0x1f06674182c9fc0c1ed670d3c9740dc538e3c1912828b8d3ff1b0f2ad37260cb): FINALIZED / SUCCESS, SAFE_APPEND with a nonempty capability.

Both rejected calls preserve the exact study and lineage snapshots. The study
remains OPEN and can be assessed by the guardian without creating another study.

The previously published 1.2.0 address does not contain this correction. The frontend
now targets the replacement address above. Historical reports remain evidence only
for their recorded deployment; the 20261016 reports target 1.2.1.

## Steward response

Updated assess_study to restrict assessment to the lineage owner or guardian before
consensus or state changes. Added a repository regression test proving an unrelated
account cannot alter or finalize an open study, and that a subsequent assessment by
either participant succeeds on that same study. The regression failed on the prior
implementation and passes with the authorization guard. The replacement deployment
has byte-for-byte source parity, and live outsider rejection followed by guardian
assessment on the same study has been verified. See LIVE_STUDIONET_EVIDENCE.md for
the complete run and deployment receipt.
