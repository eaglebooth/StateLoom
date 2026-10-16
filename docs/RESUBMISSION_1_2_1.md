# StateLoom — assessment authorization update

## Corrected deployment

- Website: https://stateloom.vercel.app
- Repository: https://github.com/eaglebooth/StateLoom
- Contract: https://explorer-studio.genlayer.com/address/0x636e8A70a9aB4E4079D12E992c26e7EE8C613fe9
- Deployment: https://explorer-studio.genlayer.com/tx/0x01b6a586ec882c199f4e11be39977eafaae06a6bb37dab6d071ebf4719be1b9d
- Version: `stateloom/1.2.1`
- Byte-for-byte source parity: 22,395 bytes; SHA-256 `72f59362be79bca6330ba20d39d903605c7a18ec3203e3fc77a0fe0b92240b7b`

## What did you change?

```text
Restricted assess_study to the lineage owner or guardian before consensus or state changes. Added a regression test that rejects an unrelated account, checks unchanged lineage/study state, and then successfully assesses the same study as either participant. Deployed version 1.2.1 with byte-for-byte source parity and updated the frontend contract address and role checks. Live testing includes outsider attempts with both incorrect and correct digests, followed by successful guardian assessment of that same study. Detailed transaction evidence and the regression are linked below.
```

## Evidence to attach

- Current rerun: 37 FINALIZED SDK transactions, 58 distinct passing assertions, no failed assertions; all 37 receipts independently verified.

- https://github.com/eaglebooth/StateLoom/blob/main/docs/STEWARD_ASSESSMENT_AUTHORIZATION_FIX.md
- https://github.com/eaglebooth/StateLoom/blob/main/tests/test_state_loom_pure.py
- https://github.com/eaglebooth/StateLoom/blob/main/docs/LIVE_STUDIONET_EVIDENCE.md
- https://github.com/eaglebooth/StateLoom/blob/main/docs/live-evidence/studionet-20261016-primary.json
- https://github.com/eaglebooth/StateLoom/blob/main/docs/live-evidence/studionet-adversarial-20261016-adversarial.json
- https://github.com/eaglebooth/StateLoom/blob/main/docs/live-evidence/studionet-20261016-primary.receipts.json
- https://github.com/eaglebooth/StateLoom/blob/main/docs/live-evidence/studionet-adversarial-20261016-adversarial.receipts.json
- https://github.com/eaglebooth/StateLoom/blob/main/docs/SOURCE_PARITY.json
- https://github.com/eaglebooth/StateLoom/blob/main/docs/FRONTEND_TRANSACTION_AUDIT_1_2_1.md

Historical 1.2.0 evidence belongs to the superseded deployment and must not be
presented as verification of this correction. Current evidence is indexed by the
replacement address and new run IDs.
