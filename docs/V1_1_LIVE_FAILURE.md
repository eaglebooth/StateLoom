# v1.1 live consensus failure

Contract: 0x10928c59f8f693F685aB936440ce54c8167E048D.
Run evidence: live-evidence/studionet-942217200.json.

Five setup writes finalized successfully. Four assessments ended UNDETERMINED;
their pre/post study snapshots are equal and no capability was issued.

Confirmed code defect: leader findings include source-bound old/new labels and
types, while the validator passed these expanded rows into the strict four-field
AI response parser. The parser rejected every expanded row. The previous
explanation attributing disagreement to AI variability was incomplete.

Source v1.2 reconstructs each bound row from independently acquired pending rows
and validates full equality. A regression test accepts an authentic expanded row
and rejects tampered source fields. Nine local tests and GenVM lint/schema pass.

The deployed v1.1 contract is immutable. A new deployment is required for the
corrected validator. Full live E2E has not passed.
