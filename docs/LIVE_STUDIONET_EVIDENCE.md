# Live StudioNet Evidence

Contract: [0x636e8A70a9aB4E4079D12E992c26e7EE8C613fe9](https://explorer-studio.genlayer.com/address/0x636e8A70a9aB4E4079D12E992c26e7EE8C613fe9)
Version: stateloom/1.2.1. Run: 20261016-primary.
37 submitted transactions; 37 finalized; 0 undetermined; 58 distinct assertions passed (66 executions, including resume rechecks).

Owner: 0xeb57bc7125fa60d7482CE12058397369AB3581f8. Guardian: 0x2da5393d7BBb9A037dc3abB56DbbC5C150fc843f. Deployer has no test role.
Outsider (ephemeral zero-value signer): 0xc635eAffDC85262f1CEc49C02301f5CCaba75F1e.

## Steward authorization regression

- Outsider assessment with an incorrect candidate digest is rejected and preserves both study and lineage.
- Outsider assessment with correct digests is also rejected; the same study remains OPEN.
- The guardian then assesses that exact study successfully and obtains SAFE_APPEND with a bound capability.
- The owner separately assesses the safe study in the adversarial supplement.

## Results

- Compatible identical layout: SAFE_APPEND; capability consumed once; epoch 1 → 2.
- Structural collision: STRUCTURAL_CONFLICT; no capability.
- Changed storage labels: SEMANTIC_RISK because INSUFFICIENT_CONTEXT; no capability.
- Unavailable source: UNRESOLVED; no capability.
- Wrong owner role, wrong capability digest, replay and stale epoch: finalized ERROR; study pre/post equality checked.

## Transactions

| Action | Caller | Finality | Execution | Explorer |
|---|---|---|---|---|
| A creates happy lineage | A | FINALIZED | SUCCESS | [0xda8515ad63de4acc1206b3090d0d7cb313dd370212172f70c32e43f5dda6f2b2](https://explorer-studio.genlayer.com/tx/0xda8515ad63de4acc1206b3090d0d7cb313dd370212172f70c32e43f5dda6f2b2) |
| A proposes verified baseline | A | FINALIZED | SUCCESS | [0xae8066f2ad05123d884d844cfc7079fc226549d488c4160e379d428dc2769f4f](https://explorer-studio.genlayer.com/tx/0xae8066f2ad05123d884d844cfc7079fc226549d488c4160e379d428dc2769f4f) |
| B accepts exact baseline consent | B | FINALIZED | SUCCESS | [0x4427d7f78b272af26929c006353efa42ceb2311c5c6027c4abe129d8570b262e](https://explorer-studio.genlayer.com/tx/0x4427d7f78b272af26929c006353efa42ceb2311c5c6027c4abe129d8570b262e) |
| A opens parallel study that will become stale | A | FINALIZED | SUCCESS | [0x548a4dcb57b3502119c0a3b32610fb697a915760a545bd462314f0a4026ca164](https://explorer-studio.genlayer.com/tx/0x548a4dcb57b3502119c0a3b32610fb697a915760a545bd462314f0a4026ca164) |
| B opens safe-compatible study | B | FINALIZED | SUCCESS | [0x04fff411288de82d640623b006e91ac09a2bf5041092c16cee4c9b1343d2ffe8](https://explorer-studio.genlayer.com/tx/0x04fff411288de82d640623b006e91ac09a2bf5041092c16cee4c9b1343d2ffe8) |
| outsider cannot poison open study with wrong digest | outsider | FINALIZED | ERROR | [0x80dafa9cd3f428533e12a6a3d82815be0076022ea638d41b30cbaa374d355ce4](https://explorer-studio.genlayer.com/tx/0x80dafa9cd3f428533e12a6a3d82815be0076022ea638d41b30cbaa374d355ce4) |
| outsider cannot assess even with correct digests | outsider | FINALIZED | ERROR | [0xd97a17712afba82bb46795816429cc52d0832baa719b8f5ffabb18e59e749ac7](https://explorer-studio.genlayer.com/tx/0xd97a17712afba82bb46795816429cc52d0832baa719b8f5ffabb18e59e749ac7) |
| B assesses safe-compatible study attempt 1 | B | FINALIZED | SUCCESS | [0x1f06674182c9fc0c1ed670d3c9740dc538e3c1912828b8d3ff1b0f2ad37260cb](https://explorer-studio.genlayer.com/tx/0x1f06674182c9fc0c1ed670d3c9740dc538e3c1912828b8d3ff1b0f2ad37260cb) |
| B cannot consume owner capability | B | FINALIZED | ERROR | [0x7e707e15d2a206a2ddbb8dd3c7d7a1952b1d2ac2b883fd47b0eaeb6a9b0467dc](https://explorer-studio.genlayer.com/tx/0x7e707e15d2a206a2ddbb8dd3c7d7a1952b1d2ac2b883fd47b0eaeb6a9b0467dc) |
| wrong capability digest rejected | A | FINALIZED | ERROR | [0x36a0764d05c014e58b86e17f83653664f15291fedd1029ee829e70320febceea](https://explorer-studio.genlayer.com/tx/0x36a0764d05c014e58b86e17f83653664f15291fedd1029ee829e70320febceea) |
| A activates exact capability | A | FINALIZED | SUCCESS | [0x1e9225754e0a585c19edcb05d892ec9635e1b210f8c68d6a1ff244f34334bd19](https://explorer-studio.genlayer.com/tx/0x1e9225754e0a585c19edcb05d892ec9635e1b210f8c68d6a1ff244f34334bd19) |
| activation replay rejected | A | FINALIZED | ERROR | [0x12f1de21ac8ad3c9fe61d29a695c24f97b090ef012572e477b65d9a1aa65d87e](https://explorer-studio.genlayer.com/tx/0x12f1de21ac8ad3c9fe61d29a695c24f97b090ef012572e477b65d9a1aa65d87e) |
| stale parallel study rejected | B | FINALIZED | ERROR | [0xf854c722152905d2d53af3b4bfb4d4120c63144c6e4cdf3c21a81f56cbc58b54](https://explorer-studio.genlayer.com/tx/0xf854c722152905d2d53af3b4bfb4d4120c63144c6e4cdf3c21a81f56cbc58b54) |
| B opens structural conflict | B | FINALIZED | SUCCESS | [0xedd78dc6f93d760e982f16a9bd3958fdb51cca57b28348caa6dc1b5948bc4c47](https://explorer-studio.genlayer.com/tx/0xedd78dc6f93d760e982f16a9bd3958fdb51cca57b28348caa6dc1b5948bc4c47) |
| B assesses structural conflict | B | FINALIZED | SUCCESS | [0xf860eb5bf95924aaaece1f9b8032a626e9b86bc8b30c86cbaecd24eca8ad4135](https://explorer-studio.genlayer.com/tx/0xf860eb5bf95924aaaece1f9b8032a626e9b86bc8b30c86cbaecd24eca8ad4135) |
| A opens unavailable source | A | FINALIZED | SUCCESS | [0xf51c83ffbeeaec94e9b78cd97dba10ccd735533127b937d7a8cbbb5f7dd28822](https://explorer-studio.genlayer.com/tx/0xf51c83ffbeeaec94e9b78cd97dba10ccd735533127b937d7a8cbbb5f7dd28822) |
| B assesses unavailable source | B | FINALIZED | SUCCESS | [0xd3b5a4d319be054eab3722fdd38f3024a1e0f9ce4029eb5658e1990f174db89b](https://explorer-studio.genlayer.com/tx/0xd3b5a4d319be054eab3722fdd38f3024a1e0f9ce4029eb5658e1990f174db89b) |
| A creates semantic-control lineage | A | FINALIZED | SUCCESS | [0xe0ed0664a479333d07fbcfa82e90c6530a45bbe6c1c3736cc347d9c205f5f194](https://explorer-studio.genlayer.com/tx/0xe0ed0664a479333d07fbcfa82e90c6530a45bbe6c1c3736cc347d9c205f5f194) |
| A proposes semantic baseline | A | FINALIZED | SUCCESS | [0xc8527fb4a2f148534d423d8647c7931e852f7db73611bbb417ff2e78e3a9c2db](https://explorer-studio.genlayer.com/tx/0xc8527fb4a2f148534d423d8647c7931e852f7db73611bbb417ff2e78e3a9c2db) |
| B accepts semantic baseline | B | FINALIZED | SUCCESS | [0x684816ccf831788d68c8f98827ffa2adf9859941c6e7b78fe6863dbb4bbd6bd4](https://explorer-studio.genlayer.com/tx/0x684816ccf831788d68c8f98827ffa2adf9859941c6e7b78fe6863dbb4bbd6bd4) |
| B opens semantic repurpose | B | FINALIZED | SUCCESS | [0x2eae86c4072a813c8dcefa0a6086cd00c80e8dd60fc613d4079cd56f3164adfa](https://explorer-studio.genlayer.com/tx/0x2eae86c4072a813c8dcefa0a6086cd00c80e8dd60fc613d4079cd56f3164adfa) |
| B assesses semantic repurpose | B | FINALIZED | SUCCESS | [0x7e4dde4e1dff54feeafe32361fe29a3e1f023e7d928ec4fd1bbb0155d40b8488](https://explorer-studio.genlayer.com/tx/0x7e4dde4e1dff54feeafe32361fe29a3e1f023e7d928ec4fd1bbb0155d40b8488) |
| A creates role-control lineage | A | FINALIZED | SUCCESS | [0xa6d5a291bad1785ee209017a90d23e25df49532965d29f1e113af24dc2ceaed5](https://explorer-studio.genlayer.com/tx/0xa6d5a291bad1785ee209017a90d23e25df49532965d29f1e113af24dc2ceaed5) |
| B cannot propose owner baseline | B | FINALIZED | ERROR | [0x1e5ef1fea69ebf3caaf3e82f3fcd91bff4c9fabcbc4ea0cf8588223265419e49](https://explorer-studio.genlayer.com/tx/0x1e5ef1fea69ebf3caaf3e82f3fcd91bff4c9fabcbc4ea0cf8588223265419e49) |

## Adversarial supplement

| A creates integrity-control lineage | A | FINALIZED | SUCCESS | [0x98b3f8df4852627bb0a542b31faeae3fe8e2746e372a679c838173b7e62bb039](https://explorer-studio.genlayer.com/tx/0x98b3f8df4852627bb0a542b31faeae3fe8e2746e372a679c838173b7e62bb039) |
| A proposes integrity baseline | A | FINALIZED | SUCCESS | [0x9229ecaf2d00665a15b6f2be2c372d9071266ab1d0fbf374ecb7e8b3ae695976](https://explorer-studio.genlayer.com/tx/0x9229ecaf2d00665a15b6f2be2c372d9071266ab1d0fbf374ecb7e8b3ae695976) |
| B accepts integrity baseline | B | FINALIZED | SUCCESS | [0x3ecd0c4519fb2461ee36271dc9ca3fd7a4454a76453ab552973196509e961471](https://explorer-studio.genlayer.com/tx/0x3ecd0c4519fb2461ee36271dc9ca3fd7a4454a76453ab552973196509e961471) |
| B opens digest-control study | B | FINALIZED | SUCCESS | [0x0e268abfc2871882cf6a94e1f6b6cb4f0f0d39017e2cc5f9e829b1824f26389f](https://explorer-studio.genlayer.com/tx/0x0e268abfc2871882cf6a94e1f6b6cb4f0f0d39017e2cc5f9e829b1824f26389f) |
| wrong old record digest is rejected | B | FINALIZED | ERROR | [0xa33c10b67c242b922e5af06a6a28042dcca6d417593c2495b79b9a74f228b0f5](https://explorer-studio.genlayer.com/tx/0xa33c10b67c242b922e5af06a6a28042dcca6d417593c2495b79b9a74f228b0f5) |
| fetched new content digest mismatch fails closed | B | FINALIZED | SUCCESS | [0x4488125dd21e7fe8c3eb4826463db99f699042dadf1134f08ed0b6a3b171ef09](https://explorer-studio.genlayer.com/tx/0x4488125dd21e7fe8c3eb4826463db99f699042dadf1134f08ed0b6a3b171ef09) |
| A creates cross-lineage control | A | FINALIZED | SUCCESS | [0x5271619f508fee57d128f1bbcf35321d442b2f756d1eab3909cdb782a4546302](https://explorer-studio.genlayer.com/tx/0x5271619f508fee57d128f1bbcf35321d442b2f756d1eab3909cdb782a4546302) |
| A proposes cross-lineage baseline | A | FINALIZED | SUCCESS | [0x67eae340a77639f2302be75f197c424c77d8449f45467a6298a64d5feb6c32e8](https://explorer-studio.genlayer.com/tx/0x67eae340a77639f2302be75f197c424c77d8449f45467a6298a64d5feb6c32e8) |
| B accepts cross-lineage baseline | B | FINALIZED | SUCCESS | [0x0ec0d25ed06baa70383de2f9343a6364f78767e92b63dbd4b583b9b04d647952](https://explorer-studio.genlayer.com/tx/0x0ec0d25ed06baa70383de2f9343a6364f78767e92b63dbd4b583b9b04d647952) |
| B opens cross-lineage safe study | B | FINALIZED | SUCCESS | [0x248712c07ad4d13ecf693ae0f9429e5574b6cc4c5e2d2a7ed64b4b4c43297789](https://explorer-studio.genlayer.com/tx/0x248712c07ad4d13ecf693ae0f9429e5574b6cc4c5e2d2a7ed64b4b4c43297789) |
| A assesses cross-lineage safe study attempt 1 | A | FINALIZED | SUCCESS | [0xff06fee0139178fd836321909714ddf70087c5d2c28f12e3d79f40bb3a1d9234](https://explorer-studio.genlayer.com/tx/0xff06fee0139178fd836321909714ddf70087c5d2c28f12e3d79f40bb3a1d9234) |
| foreign lineage capability is rejected | A | FINALIZED | ERROR | [0xd490c2814cfdc2622a96642b150ec0bb662acdc39ddf5ef3c4007f36893e08c4](https://explorer-studio.genlayer.com/tx/0xd490c2814cfdc2622a96642b150ec0bb662acdc39ddf5ef3c4007f36893e08c4) |
| exact bound capability still activates | A | FINALIZED | SUCCESS | [0xc55501bb7189bd8900056ad996e381b0fe1c7f71deafc2f795b75c9196ea067a](https://explorer-studio.genlayer.com/tx/0xc55501bb7189bd8900056ad996e381b0fe1c7f71deafc2f795b75c9196ea067a) |

## Sources

Public Sourcify records were fetched from exact Sepolia chain/address endpoints. Raw response SHA-256 values were bound into assessment arguments.

- safeOld: [0x5508c89BE3Fe14Fa6d1770aa5690681E99185346](https://sourcify.dev/server/v2/contract/11155111/0x5508c89BE3Fe14Fa6d1770aa5690681E99185346?fields=all); 16787 bytes; SHA-256 `3af2d10d67f4767c7f1d7f509dba7c5a7b55bfba45f2294eda180e951331242c`.
- safeNew: [0x0B3D92b913630649aD98EBC1A011E40f77d9B653](https://sourcify.dev/server/v2/contract/11155111/0x0B3D92b913630649aD98EBC1A011E40f77d9B653?fields=all); 19152 bytes; SHA-256 `eee601513cb8f3fd379acdddcf89ca05b67d28564abe2ee77b14bd49752509a3`.
- structural: [0x946406805023F1B268F3Cc9190EB9Ff91A566973](https://sourcify.dev/server/v2/contract/11155111/0x946406805023F1B268F3Cc9190EB9Ff91A566973?fields=all); 31325 bytes; SHA-256 `3a28c0268ae13f9642cbc16f109b64c00f353c5be25a72dd936dc5cf99746e32`.
- semanticNew: [0x87c776691b87F6Df9fb07be9e3ECaF176319f7b7](https://sourcify.dev/server/v2/contract/11155111/0x87c776691b87F6Df9fb07be9e3ECaF176319f7b7?fields=all); 33494 bytes; SHA-256 `b08f33f58ff2c4dd5f2856c458a5f1dcb65bc48e70933c9f52e6b0adf160f623`.

## Scope and remaining verification

Machine evidence with exact arguments and state readbacks: [run JSON](live-evidence/studionet-20261016-primary.json) and [adversarial supplement](live-evidence/studionet-adversarial-20261016-adversarial.json).
These runs used signed SDK transactions. A true append fixture and runtime semantic equivalence are not established by this report.
The positive fixture preserves the layout. Matching labels/types alone do not prove unchanged runtime meaning.
Negative equality snapshots in this runner cover the targeted object; they do not constitute a complete global state audit.
