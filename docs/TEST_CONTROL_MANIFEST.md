# Test Control Manifest

Every negative path is paired with a positive path and differs by one meaningful
dimension. Before and after snapshots include lineage, study, findings, capability,
epoch, active address, digests, consumed flag and counters.

| Control | Single changed dimension | Required invariant |
|---|---|---|
| wrong guardian | caller | complete state unchanged |
| wrong record digest | raw response digest | no assessment stored |
| wrong address record | response identity | verdict cannot become safe |
| structural collision | one occupied type/position | no capability |
| semantic repurpose | one field meaning | no capability |
| unavailable source | source availability | fail closed |
| stale study | lineage epoch | activation rejected unchanged |
| replay | consumed flag | second activation rejected unchanged |
| cross-lineage capability | lineage binding | rejected unchanged |
| malicious leader | plausible false relation | independent validator rejects |

Local mocks prove parsers and deterministic gates only. They never substitute for the
live StudioNet consensus run or the independent public Sourcify resources.
