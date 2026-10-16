# Frontend / live-state audit — 1.2.1

Date: 2026-10-16. Production URL: https://stateloom.vercel.app.
Contract: `0x636e8A70a9aB4E4079D12E992c26e7EE8C613fe9`.
Vercel deployment: `dpl_7DpJDCrKcgsWhcBLmVtw1NQoJwxu`, READY.

The audit used the actual production page and direct StudioNet reads. It did not
inject mocked transaction results into the browser.

## Observed production readbacks

For lineage
`0xeb57bc7125fa60d7482ce12058397369ab3581f8:live-20261016-primary`
and its epoch-1 candidate study at
`0x0B3D92b913630649aD98EBC1A011E40f77d9B653`:

- Status line: `CONSUMED`.
- Message: `Authoritative latest-final state synchronized.`
- Epoch: `2`.
- Active implementation: `0x0b3d…b653`.
- Consensus verdict: `SAFE APPEND`.
- With no connected wallet, both consensus and activation buttons were disabled.

For the epoch-2 structural study with candidate
`0x946406805023F1B268F3Cc9190EB9Ff91A566973`:

- Status and verdict: `STRUCTURAL CONFLICT`.
- Reason: `occupied storage changed`.
- Activation button: disabled.

## Implementation checks

- Frontend defaults and build configuration use the replacement address.
- Consensus requires a synchronized OPEN study, current epoch, and owner/guardian.
- Activation requires the owner, an unconsumed capability and matching epoch.
- Changing contract, lineage or study clears the relevant previous readback.
- Sync errors clear state and display the RPC error rather than retaining a success.
- Transient read-only fetch failures are retried at most twice; raw signed submissions
  are not automatically resent after ambiguous network failures.
- The existing write path still requires FINALIZED, successful leader execution and
  action-specific post-state verification before displaying success.

This is a production readback audit plus signed SDK contract E2E. It is not evidence
of completing signatures through a particular browser-wallet extension.
