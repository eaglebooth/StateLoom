# Test Resource Manifest

StateLoom accepts only the Sourcify v2 lookup at
`https://sourcify.dev/server/v2/contract/{chainId}/{address}?fields=all` as the
authoritative remote record. Identity is bound to the requested chain and deployed
implementation address. The raw response SHA-256 is supplied to the transaction and
checked before parsing.

| Class | Exact public resource | Raw SHA-256 | Expected result |
|---|---|---|---|
| positive old | Sepolia `0x5508c89BE3Fe14Fa6d1770aa5690681E99185346` | `3af2d10d67f4767c7f1d7f509dba7c5a7b55bfba45f2294eda180e951331242c` | baseline |
| positive candidate | Sepolia `0x0B3D92b913630649aD98EBC1A011E40f77d9B653` | `eee601513cb8f3fd379acdddcf89ca05b67d28564abe2ee77b14bd49752509a3` | `SAFE_APPEND` (identical normalized layout) |
| semantic old / structural candidate | Sepolia `0x946406805023F1B268F3Cc9190EB9Ff91A566973` | `3a28c0268ae13f9642cbc16f109b64c00f353c5be25a72dd936dc5cf99746e32` | baseline / `STRUCTURAL_CONFLICT` |
| semantic candidate | Sepolia `0x87c776691b87F6Df9fb07be9e3ECaF176319f7b7` | `b08f33f58ff2c4dd5f2856c458a5f1dcb65bc48e70933c9f52e6b0adf160f623` | `SEMANTIC_RISK` |
| unavailable control | Sepolia `0x000000000000000000000000000000000000dEaD` | deliberately unmatched | `UNRESOLVED` |
| identity control | record from a different chain/address | rejected |
| integrity control | correct URL with wrong raw digest | rejected |

All live resources are independently hosted Sourcify records fetched by the contract,
not JSON uploaded by a test wallet and not files served by this repository. Exact URLs,
response byte counts and transaction-bound hashes are recorded in the live evidence.
A project README, GitHub issue, user-entered prose, or AI answer is never accepted as
evidence that deployed source/layout is authentic. Sourcify verification is
source-bytecode provenance, not an audit or proof of runtime safety.
