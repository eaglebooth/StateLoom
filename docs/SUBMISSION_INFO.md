# StateLoom submission information

## Identity

- Project name: `StateLoom — Consensus-Gated Storage Lineage`
- Primary tag: `Developer Tools`
- Suggested secondary tags: `Security`, `AI & Agents`
- Logo: `public/stateloom-logo.png`

## One-liner

StateLoom advances verified EVM storage lineages only when deterministic layout checks and validator-reviewed semantic continuity agree.

## Description

StateLoom is a GenLayer dApp for maintaining an on-chain lineage of deployed EVM implementations. An owner and a distinct guardian bind an initial implementation to the SHA-256 of its exact Sourcify v2 response. Either participant may open a candidate study. Validators independently fetch the exact chain/address records, recompute both content commitments, parse compiler storage layouts, reject occupied-slot collisions deterministically, and review only the bounded semantic question of whether persistent fields retain their meaning. Missing sources, digest mismatches, malformed layouts, structural conflicts, ambiguity, stale epochs and validator disagreement fail closed. A positive verdict creates a study-, lineage-, epoch-, implementation- and evidence-bound capability. Only the owner can consume it once to advance the canonical lineage. The deployer receives no protocol role. StateLoom does not upgrade external proxies and does not claim formal audit or runtime-equivalence status.

## Exact reviewer path

1. Open the website, connect a wallet to GenLayer StudioNet (`61999`), and keep the displayed contract set to `0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd`.
2. Wallet A creates a lineage with Wallet B as guardian and source chain `11155111`.
3. Wallet A proposes baseline `0x5508c89BE3Fe14Fa6d1770aa5690681E99185346` with digest `3af2d10d67f4767c7f1d7f509dba7c5a7b55bfba45f2294eda180e951331242c`; Wallet B syncs and accepts the displayed consent digest.
4. Either participant opens candidate `0x0B3D92b913630649aD98EBC1A011E40f77d9B653`, then assesses it with old digest `3af2d10d67f4767c7f1d7f509dba7c5a7b55bfba45f2294eda180e951331242c` and new digest `eee601513cb8f3fd379acdddcf89ca05b67d28564abe2ee77b14bd49752509a3`.
5. After the assessment is finalized and read back as `SAFE_APPEND`, Wallet A activates the exact displayed capability. Sync again and verify the study is `CONSUMED`, the lineage epoch advanced from `1` to `2`, and the candidate became active.

## Expected verification outcome

The reviewer should see every success message only after `FINALIZED` execution and matching latest-final state readback. The positive path ends with a consumed single-use capability, epoch `2`, and the candidate as active implementation. Wrong actor, wrong/stolen capability, replay and stale-epoch writes finalize with execution error and unchanged affected state. Wrong fetched-content digest resolves to `UNRESOLVED` with no capability. Structural and semantic conflicts remain non-activatable.

## Links

- Website: `<ADD_VERCEL_URL>`
- GitHub: https://github.com/eaglebooth/StateLoom
- Contract: https://explorer-studio.genlayer.com/address/0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd
- Deployment transaction: https://explorer-studio.genlayer.com/tx/0xe2ebb61dc7b83ce00dbb549108607e896f2c321654db732c1ea376993218868f
- Human-readable evidence: `docs/LIVE_STUDIONET_EVIDENCE.md`
- Primary machine report: `docs/live-evidence/studionet-942217300.json`
- Adversarial machine report: `docs/live-evidence/studionet-adversarial-942217400.json`
- Source parity: `docs/SOURCE_PARITY.json`

## Evidence summary

- Exact deployment: `stateloom/1.2.0`, deployment `FINALIZED`, constructor `SUCCESS`, consensus `Accepted`.
- Two non-deployer actors: owner `0xeb57bc7125fa60d7482CE12058397369AB3581f8`; guardian `0x2da5393d7BBb9A037dc3abB56DbbC5C150fc843f`.
- `35/35` behavioral transactions finalized.
- `52/52` live assertions passed; `0` failed.
- Deployed source equals repository contract byte-for-byte: `22225` bytes, SHA-256 `f3dbb9c1dbe04545caf1d9e320234890cd3dd2d61668787daf8001a9c68dffa2`.
- Local verification: `9/9` pytest, GenVM lint/schema, ESLint, TypeScript and Next.js production build pass.

## Honest scope

The positive public fixture has an identical normalized occupied layout. It proves the live safe/activation workflow, content binding and replay protections, but is not evidence of a newly appended field or whole-program runtime semantic equivalence. The malicious-leader binding control is local because callers cannot force a malicious StudioNet leader; the validator regression rejects tampered leader findings.
