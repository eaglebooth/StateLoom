# Live StudioNet Evidence

Contract: [0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd](https://explorer-studio.genlayer.com/address/0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd)
Version: stateloom/1.2.0. Run: 942217300.
Deployment: [0xe2ebb61dc7b83ce00dbb549108607e896f2c321654db732c1ea376993218868f](https://explorer-studio.genlayer.com/tx/0xe2ebb61dc7b83ce00dbb549108607e896f2c321654db732c1ea376993218868f) — `FINALIZED`, constructor `SUCCESS`, consensus `Accepted`.
35 finalized transactions across two signed SDK runs; 52 assertions passed and zero
failed. The primary lifecycle contains 22 transactions / 33 assertions. The focused
adversarial supplement contains 13 transactions / 19 assertions.

Owner: 0xeb57bc7125fa60d7482CE12058397369AB3581f8. Guardian: 0x2da5393d7BBb9A037dc3abB56DbbC5C150fc843f. Deployer has no test role.

## Results

- Compatible identical layout: SAFE_APPEND; capability consumed once; epoch 1 → 2.
- Structural collision: STRUCTURAL_CONFLICT; no capability.
- Changed storage labels: SEMANTIC_RISK because INSUFFICIENT_CONTEXT; no capability.
- Unavailable source: UNRESOLVED; no capability.
- Wrong owner role, wrong capability digest, replay and stale epoch: finalized ERROR; study pre/post equality checked.

## Transactions

| Action | Caller | Finality | Execution | Explorer |
|---|---|---|---|---|
| A creates happy lineage | A | FINALIZED | SUCCESS | [0xec7a12cb412c39fb3191fcd02404d5c977f0395a7f4a9aa0489c827a8fc3a4cf](https://explorer-studio.genlayer.com/tx/0xec7a12cb412c39fb3191fcd02404d5c977f0395a7f4a9aa0489c827a8fc3a4cf) |
| A proposes verified baseline | A | FINALIZED | SUCCESS | [0x788983aabf64df3259d244d24353b3783e5575aade82963ee782c710f503fdd6](https://explorer-studio.genlayer.com/tx/0x788983aabf64df3259d244d24353b3783e5575aade82963ee782c710f503fdd6) |
| B accepts exact baseline consent | B | FINALIZED | SUCCESS | [0x1b5a5064ebc955bfbe48b31c9cd68ce18b8feae45ab7e309f9ea703c712b0f5b](https://explorer-studio.genlayer.com/tx/0x1b5a5064ebc955bfbe48b31c9cd68ce18b8feae45ab7e309f9ea703c712b0f5b) |
| A opens parallel study that will become stale | A | FINALIZED | SUCCESS | [0x141cfd51834c40adecad658a99e238a3d4b8270fae13ab995a85936e834a12cc](https://explorer-studio.genlayer.com/tx/0x141cfd51834c40adecad658a99e238a3d4b8270fae13ab995a85936e834a12cc) |
| B opens safe-compatible study | B | FINALIZED | SUCCESS | [0x444757f720659f64f2c4aa7b27cb19001974bc6f12166fe3dbb20fae782e50da](https://explorer-studio.genlayer.com/tx/0x444757f720659f64f2c4aa7b27cb19001974bc6f12166fe3dbb20fae782e50da) |
| B assesses safe-compatible study attempt 1 | B | FINALIZED | SUCCESS | [0xd540068e27ee81b0d256dff36b36650e5eb4e9e996da811d2a0cef11576cf2b2](https://explorer-studio.genlayer.com/tx/0xd540068e27ee81b0d256dff36b36650e5eb4e9e996da811d2a0cef11576cf2b2) |
| B cannot consume owner capability | B | FINALIZED | ERROR | [0xcd859d14d665f10feb3a794725a853cd5d190bc657dcf11a9218a63ea46ec133](https://explorer-studio.genlayer.com/tx/0xcd859d14d665f10feb3a794725a853cd5d190bc657dcf11a9218a63ea46ec133) |
| wrong capability digest rejected | A | FINALIZED | ERROR | [0x2877bee1dc3a6bb301ed5aad69c7ce591f2e719075684ad10490e736cc7ac481](https://explorer-studio.genlayer.com/tx/0x2877bee1dc3a6bb301ed5aad69c7ce591f2e719075684ad10490e736cc7ac481) |
| A activates exact capability | A | FINALIZED | SUCCESS | [0x2bee51b88ef37f8162cdb3f985b6eccc70f0868ceb97c65413d5916def6f56ce](https://explorer-studio.genlayer.com/tx/0x2bee51b88ef37f8162cdb3f985b6eccc70f0868ceb97c65413d5916def6f56ce) |
| activation replay rejected | A | FINALIZED | ERROR | [0x3e039a653e3b28a188a980da7fff07e9d14740287504f02ccc20bdc254193458](https://explorer-studio.genlayer.com/tx/0x3e039a653e3b28a188a980da7fff07e9d14740287504f02ccc20bdc254193458) |
| stale parallel study rejected | B | FINALIZED | ERROR | [0x3d66c281c341ac18cbe205a20c5e0e2dfcbf980a7e96e8e0f32301d0139510eb](https://explorer-studio.genlayer.com/tx/0x3d66c281c341ac18cbe205a20c5e0e2dfcbf980a7e96e8e0f32301d0139510eb) |
| B opens structural conflict | B | FINALIZED | SUCCESS | [0x86db5b76a39fec3847b3acff4ff66e2683059b0d28f4b2f5520e79bda6960c40](https://explorer-studio.genlayer.com/tx/0x86db5b76a39fec3847b3acff4ff66e2683059b0d28f4b2f5520e79bda6960c40) |
| B assesses structural conflict | B | FINALIZED | SUCCESS | [0x4dd81e130edbaa9e89c04f25ee614a56e24e5aeffc4959605308206c50f6e14b](https://explorer-studio.genlayer.com/tx/0x4dd81e130edbaa9e89c04f25ee614a56e24e5aeffc4959605308206c50f6e14b) |
| A opens unavailable source | A | FINALIZED | SUCCESS | [0xffa779584b7b165e541a6d1f623a28bdec6e60da72e1d897b642668c7932838c](https://explorer-studio.genlayer.com/tx/0xffa779584b7b165e541a6d1f623a28bdec6e60da72e1d897b642668c7932838c) |
| B assesses unavailable source | B | FINALIZED | SUCCESS | [0xeb5de1872c2f8f95abbd9beda277dbb3e82286607e4176f8b5c5d2e4fbf05d34](https://explorer-studio.genlayer.com/tx/0xeb5de1872c2f8f95abbd9beda277dbb3e82286607e4176f8b5c5d2e4fbf05d34) |
| A creates semantic-control lineage | A | FINALIZED | SUCCESS | [0x18dd51ea546167bab793cbf9ceae2c6eb72063708d446834ef72e53ad8b0ef38](https://explorer-studio.genlayer.com/tx/0x18dd51ea546167bab793cbf9ceae2c6eb72063708d446834ef72e53ad8b0ef38) |
| A proposes semantic baseline | A | FINALIZED | SUCCESS | [0xdb6d9693a4cc2d44109cddbf49b453cc1f2729b0f5d1d8d4c9b0834496c881bb](https://explorer-studio.genlayer.com/tx/0xdb6d9693a4cc2d44109cddbf49b453cc1f2729b0f5d1d8d4c9b0834496c881bb) |
| B accepts semantic baseline | B | FINALIZED | SUCCESS | [0xf96081df0dc5a6146c8750b8d47ea7f39661fbde3a1ba66611bcdf9cbe7b0ea5](https://explorer-studio.genlayer.com/tx/0xf96081df0dc5a6146c8750b8d47ea7f39661fbde3a1ba66611bcdf9cbe7b0ea5) |
| B opens semantic repurpose | B | FINALIZED | SUCCESS | [0x4b2565d161eefa06e9aba280da44385f4b260d298c6e979c071832b809d4205e](https://explorer-studio.genlayer.com/tx/0x4b2565d161eefa06e9aba280da44385f4b260d298c6e979c071832b809d4205e) |
| B assesses semantic repurpose | B | FINALIZED | SUCCESS | [0x380354e5b68bae82ffb4c84e4bef4c613778f72fae8c6a535bff57fb4d123fd2](https://explorer-studio.genlayer.com/tx/0x380354e5b68bae82ffb4c84e4bef4c613778f72fae8c6a535bff57fb4d123fd2) |
| A creates role-control lineage | A | FINALIZED | SUCCESS | [0xdf7967975f1053d53535fe928b514497cc12f7bff202e4d11186756abe709d23](https://explorer-studio.genlayer.com/tx/0xdf7967975f1053d53535fe928b514497cc12f7bff202e4d11186756abe709d23) |
| B cannot propose owner baseline | B | FINALIZED | ERROR | [0x24df9bdc17ca3c5558021fc751855aeca784e18bfbfa379013a6660431ed9f6e](https://explorer-studio.genlayer.com/tx/0x24df9bdc17ca3c5558021fc751855aeca784e18bfbfa379013a6660431ed9f6e) |

## Adversarial supplement

Machine report: [studionet-adversarial-942217400.json](live-evidence/studionet-adversarial-942217400.json).

| Action | Caller | Finality | Execution | Explorer |
|---|---|---|---|---|
| A creates integrity-control lineage | A | FINALIZED | SUCCESS | [0x39e5…686d](https://explorer-studio.genlayer.com/tx/0x39e571656c9ef9ef7a389ef04ec94ef162191ea7f5cf11be8dbf1ef97f75868d) |
| A proposes integrity baseline | A | FINALIZED | SUCCESS | [0x098a…88b8](https://explorer-studio.genlayer.com/tx/0x098a83bed42d54bef633fb2ab2a4b91132b21887b54feaf4289bcb81607888b8) |
| B accepts integrity baseline | B | FINALIZED | SUCCESS | [0x4544…a439](https://explorer-studio.genlayer.com/tx/0x454443a541ee0ead63ee6443a431c700664fef8e6a76938f4f1d4be7de76a439) |
| B opens digest-control study | B | FINALIZED | SUCCESS | [0x0f0e…2b68](https://explorer-studio.genlayer.com/tx/0x0f0ee6977882adc6be5df36cd7af945b714be2b758334b617420d5c344b62b68) |
| Wrong active-record digest rejected | B | FINALIZED | ERROR | [0xcd1a…e1f4](https://explorer-studio.genlayer.com/tx/0xcd1adb5c1de2feda7bf37003ce8cef85f17f0951502d44c3e7b1e5315ce6e1f4) |
| Fetched candidate digest mismatch fails closed | B | FINALIZED | SUCCESS | [0xed0a…fbdc](https://explorer-studio.genlayer.com/tx/0xed0a9c9b618cb0c3ba20a7d5d1c429758afc13c0dd2c1ca356551193e1cbfbdc) |
| A creates cross-lineage control | A | FINALIZED | SUCCESS | [0x826c…3d37](https://explorer-studio.genlayer.com/tx/0x826cf446a9154c50e0311dd412234f7883328fc85d2128c81c1423a100ce3d37) |
| A proposes cross-lineage baseline | A | FINALIZED | SUCCESS | [0xf5fb…a486](https://explorer-studio.genlayer.com/tx/0xf5fba26b247f8915e9a2e8316996cff50b53693aeeae6e95f2398858e3d8a486) |
| B accepts cross-lineage baseline | B | FINALIZED | SUCCESS | [0x1a45…3456](https://explorer-studio.genlayer.com/tx/0x1a458b26a6d701a3c584b5006ae85d4e40096fbc9f075dcc017d2901ce8d3456) |
| B opens cross-lineage safe study | B | FINALIZED | SUCCESS | [0xb879…623c](https://explorer-studio.genlayer.com/tx/0xb879453babd84333cc86fcdce54ade7a820ec51d48b44cff739c49d5ba62623c) |
| B assesses bound safe study | B | FINALIZED | SUCCESS | [0xadfb…e6e3](https://explorer-studio.genlayer.com/tx/0xadfb8bc5d9fc32d8be8254e69eb9edbf8245876a55679cd1e49c7f75108e86e3) |
| Foreign-lineage capability rejected | A | FINALIZED | ERROR | [0x5563…d57e](https://explorer-studio.genlayer.com/tx/0x5563e7ce4e55bfadca2149ea34907c7c6958f19026b2b11889fbac3029f0d57e) |
| Exact study-bound capability activates | A | FINALIZED | SUCCESS | [0x8283…d19c](https://explorer-studio.genlayer.com/tx/0x8283fa6f6d01fdded798787650dd9ee7372fe9cae14ff4dd95d4d978a887d19c) |

The wrong active-record digest and foreign-capability transactions finalized with
execution `ERROR` and exact affected-object pre/post equality. The fetched-content
digest mismatch finalized successfully into `ASSESSED / UNRESOLVED` with an empty
capability, proving the positive state remains unreachable when the commitment does
not match the bytes fetched by validators.

## Sources

Public Sourcify records were fetched from exact Sepolia chain/address endpoints. Raw response SHA-256 values were bound into assessment arguments.

- safeOld: [0x5508c89BE3Fe14Fa6d1770aa5690681E99185346](https://sourcify.dev/server/v2/contract/11155111/0x5508c89BE3Fe14Fa6d1770aa5690681E99185346?fields=all); 16787 bytes; SHA-256 `3af2d10d67f4767c7f1d7f509dba7c5a7b55bfba45f2294eda180e951331242c`.
- safeNew: [0x0B3D92b913630649aD98EBC1A011E40f77d9B653](https://sourcify.dev/server/v2/contract/11155111/0x0B3D92b913630649aD98EBC1A011E40f77d9B653?fields=all); 19152 bytes; SHA-256 `eee601513cb8f3fd379acdddcf89ca05b67d28564abe2ee77b14bd49752509a3`.
- structural: [0x946406805023F1B268F3Cc9190EB9Ff91A566973](https://sourcify.dev/server/v2/contract/11155111/0x946406805023F1B268F3Cc9190EB9Ff91A566973?fields=all); 31325 bytes; SHA-256 `3a28c0268ae13f9642cbc16f109b64c00f353c5be25a72dd936dc5cf99746e32`.
- semanticNew: [0x87c776691b87F6Df9fb07be9e3ECaF176319f7b7](https://sourcify.dev/server/v2/contract/11155111/0x87c776691b87F6Df9fb07be9e3ECaF176319f7b7?fields=all); 33494 bytes; SHA-256 `b08f33f58ff2c4dd5f2856c458a5f1dcb65bc48e70933c9f52e6b0adf160f623`.

## Scope and remaining verification

Machine evidence with exact arguments and state readbacks: [primary run JSON](live-evidence/studionet-942217300.json)
and [adversarial supplement JSON](live-evidence/studionet-adversarial-942217400.json).
Both runs used signed SDK transactions from the two non-deployer test actors. Deployed
source parity is independently recorded in [SOURCE_PARITY.json](SOURCE_PARITY.json).
A true append fixture and runtime semantic equivalence are not established by this report.
The positive fixture preserves the layout. Matching labels/types alone do not prove unchanged runtime meaning.
Negative equality snapshots in this runner cover the targeted object; they do not constitute a complete global state audit.
