import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const file=process.argv[2]||'docs/live-evidence/studionet-942217300.json';
const r=JSON.parse(readFileSync(file,'utf8'));
const base='https://explorer-studio.genlayer.com';
const failures=r.assertions.filter(x=>!x.pass);
if(failures.length||!r.final?.happy)throw new Error('Incomplete or failed run');
const supplementPath='docs/live-evidence/studionet-adversarial-942217400.json';
const supplement=existsSync(supplementPath)?JSON.parse(readFileSync(supplementPath,'utf8')):null;
if(supplement&&(supplement.assertions.some(x=>!x.pass)||!supplement.final?.version))throw new Error('Incomplete or failed adversarial supplement');
const transactions=[...r.transactions,...(supplement?.transactions||[])];
const assertions=[...r.assertions,...(supplement?.assertions||[])];
const lines=['# Live StudioNet Evidence','',`Contract: [${r.contract}](${base}/address/${r.contract})`,
`Version: ${r.final.version}. Run: ${r.run}.`,
`${transactions.length} finalized transactions across signed SDK runs; ${assertions.length} assertions passed.`,
'',`Owner: ${r.actors.owner}. Guardian: ${r.actors.guardian}. Deployer has no test role.`,
'','## Results','',
'- Compatible identical layout: SAFE_APPEND; capability consumed once; epoch 1 → 2.',
'- Structural collision: STRUCTURAL_CONFLICT; no capability.',
'- Changed storage labels: SEMANTIC_RISK because INSUFFICIENT_CONTEXT; no capability.',
'- Unavailable source: UNRESOLVED; no capability.',
'- Wrong owner role, wrong capability digest, replay and stale epoch: finalized ERROR; study pre/post equality checked.',
'','## Transactions','',
'| Action | Caller | Finality | Execution | Explorer |',
'|---|---|---|---|---|',
...r.transactions.map(t=>`| ${t.label} | ${t.caller===r.actors.owner?'A':'B'} | ${t.status} | ${t.execution} | [${t.hash}](${base}/tx/${t.hash}) |`),
'','## Adversarial supplement','',
...(supplement?supplement.transactions.map(t=>`| ${t.label} | ${t.caller===r.actors.owner?'A':'B'} | ${t.status} | ${t.execution} | [${t.hash}](${base}/tx/${t.hash}) |`):['No supplemental run loaded.']),
'','## Sources','',
'Public Sourcify records were fetched from exact Sepolia chain/address endpoints. Raw response SHA-256 values were bound into assessment arguments.',
'',...Object.entries(r.sources).map(([name,s])=>`- ${name}: [${s.address}](${s.url}); ${s.bytes} bytes; SHA-256 \`${s.sha256}\`.`),
'','## Scope and remaining verification','',
`Machine evidence with exact arguments and state readbacks: [run JSON](live-evidence/studionet-${r.run}.json) and [adversarial supplement](live-evidence/studionet-adversarial-942217400.json).`,
'These runs used signed SDK transactions. A true append fixture and runtime semantic equivalence are not established by this report.',
'The positive fixture preserves the layout. Matching labels/types alone do not prove unchanged runtime meaning.',
'Negative equality snapshots in this runner cover the targeted object; they do not constitute a complete global state audit.',''];
writeFileSync('docs/LIVE_STUDIONET_EVIDENCE.md',lines.join('\n'));
const parity=JSON.parse(readFileSync('docs/SOURCE_PARITY.json','utf8'));
if(!parity.byteForByteEqual||parity.address.toLowerCase()!==r.contract.toLowerCase())throw new Error('Deployed source parity is not verified');
const deployment={network:r.network,address:r.contract,versionReadback:r.final.version,run:r.run,transactions:transactions.length,assertions:assertions.length,evidence:[`docs/live-evidence/studionet-${r.run}.json`,supplementPath],deploymentTransaction:'0xe2ebb61dc7b83ce00dbb549108607e896f2c321654db732c1ea376993218868f',sourceParity:{verified:true,evidence:'docs/SOURCE_PARITY.json',sha256:parity.localSha256},superseded:['0xCf8A601f3322c82594011ACA23185FD7F59ccB68','0x10928c59f8f693F685aB936440ce54c8167E048D']};
writeFileSync('deployments/studionet.json',JSON.stringify(deployment,null,2)+'\n');
console.log(`Rendered ${transactions.length} tx links; ${assertions.length} passing assertions`);
