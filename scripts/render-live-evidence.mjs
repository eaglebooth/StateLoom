import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const file=process.argv[2]||'docs/live-evidence/studionet-942217300.json';
const r=JSON.parse(readFileSync(file,'utf8'));
const base='https://explorer-studio.genlayer.com';
const failures=r.assertions.filter(x=>!x.pass);
if(failures.length||!r.final?.happy)throw new Error('Incomplete or failed run');
const supplementPath=process.argv[3]||'docs/live-evidence/studionet-adversarial-942217400.json';
const supplement=existsSync(supplementPath)?JSON.parse(readFileSync(supplementPath,'utf8')):null;
if(supplement&&(supplement.assertions.some(x=>!x.pass)||!supplement.final?.version))throw new Error('Incomplete or failed adversarial supplement');
if(supplement&&supplement.contract.toLowerCase()!==r.contract.toLowerCase())throw new Error('Supplement belongs to another deployment');
if(r.final.version!=='stateloom/1.2.1'||!supplement)throw new Error('Current authorization report requires version 1.2.1 and the supplement');
const outsiderTxs=r.transactions.filter(t=>t.caller?.toLowerCase()===r.actors.outsider?.toLowerCase()&&t.method==='assess_study');
if(outsiderTxs.length<2||outsiderTxs.some(t=>t.status!=='FINALIZED'||t.execution!=='ERROR'||t.readback.before?.study?.status!=='OPEN'||t.readback.after?.study?.status!=='OPEN'||!t.readback.before?.lineage||JSON.stringify(t.readback.before)!==JSON.stringify(t.readback.after)))throw new Error('Missing verified outsider rejection/state equality on an OPEN study');
const protectedStudy=outsiderTxs[0].args[0];
if(!outsiderTxs.some(t=>t.args[1]===r.sources.safeOld.sha256&&t.args[2]===r.sources.safeNew.sha256)||!outsiderTxs.some(t=>t.args[1]===r.sources.safeOld.sha256&&t.args[2]!==r.sources.safeNew.sha256))throw new Error('Missing distinct wrong/correct digest outsider controls');
const lastOutsiderIndex=Math.max(...outsiderTxs.map(t=>r.transactions.indexOf(t)));
if(!outsiderTxs.every(t=>t.args[0]===protectedStudy)||!r.transactions.some((t,index)=>index>lastOutsiderIndex&&t.method==='assess_study'&&t.args[0]===protectedStudy&&t.caller?.toLowerCase()===r.actors.guardian.toLowerCase()&&t.status==='FINALIZED'&&t.execution==='SUCCESS'&&t.readback.after?.study?.status==='ASSESSED'&&t.readback.after.study.verdict==='SAFE_APPEND'))throw new Error('Missing same-study guardian assessment after outsider rejection');
if(!supplement.transactions.some(t=>t.method==='assess_study'&&t.caller?.toLowerCase()===r.actors.owner.toLowerCase()&&t.status==='FINALIZED'&&t.execution==='SUCCESS'&&t.readback.after?.verdict==='SAFE_APPEND'))throw new Error('Missing successful owner assessment');
const transactions=[...r.transactions,...(supplement?.transactions||[])];
const assertionExecutions=r.assertions.length+(supplement?.assertions.length||0);
const assertions=[...new Map(r.assertions.map(a=>[a.label,a])).values(),...new Map((supplement?.assertions||[]).map(a=>[a.label,a])).values()];
const finalized=transactions.filter(t=>t.status==='FINALIZED');
if(transactions.some(t=>!['FINALIZED','UNDETERMINED'].includes(t.status)))throw new Error('Pending or canceled transaction in report');
const deploymentTx=process.argv[4]||null;
if(deploymentTx&&!/^0x[0-9a-fA-F]{64}$/.test(deploymentTx))throw new Error('Invalid deployment transaction');
const parity=JSON.parse(readFileSync('docs/SOURCE_PARITY.json','utf8'));
if(!parity.byteForByteEqual||parity.address.toLowerCase()!==r.contract.toLowerCase())throw new Error('Deployed source parity is not verified');
const lines=['# Live StudioNet Evidence','',`Contract: [${r.contract}](${base}/address/${r.contract})`,
`Version: ${r.final.version}. Run: ${r.run}.`,
`${transactions.length} submitted transactions; ${finalized.length} finalized; ${transactions.length-finalized.length} undetermined; ${assertions.length} distinct assertions passed (${assertionExecutions} executions, including resume rechecks).`,
'',`Owner: ${r.actors.owner}. Guardian: ${r.actors.guardian}. Deployer has no test role.`,
`Outsider (ephemeral zero-value signer): ${r.actors.outsider||'not used'}.`,
'', '## Steward authorization regression', '',
'- Outsider assessment with an incorrect candidate digest is rejected and preserves both study and lineage.',
'- Outsider assessment with correct digests is also rejected; the same study remains OPEN.',
'- The guardian then assesses that exact study successfully and obtains SAFE_APPEND with a bound capability.',
'- The owner separately assesses the safe study in the adversarial supplement.',
'','## Results','',
'- Compatible identical layout: SAFE_APPEND; capability consumed once; epoch 1 → 2.',
'- Structural collision: STRUCTURAL_CONFLICT; no capability.',
'- Changed storage labels: SEMANTIC_RISK because INSUFFICIENT_CONTEXT; no capability.',
'- Unavailable source: UNRESOLVED; no capability.',
'- Wrong owner role, wrong capability digest, replay and stale epoch: finalized ERROR; study pre/post equality checked.',
'','## Transactions','',
'| Action | Caller | Finality | Execution | Explorer |',
'|---|---|---|---|---|',
...r.transactions.map(t=>`| ${t.label} | ${t.caller===r.actors.owner?'A':t.caller===r.actors.guardian?'B':'outsider'} | ${t.status} | ${t.execution} | [${t.hash}](${base}/tx/${t.hash}) |`),
'','## Adversarial supplement','',
...(supplement?supplement.transactions.map(t=>`| ${t.label} | ${t.caller===r.actors.owner?'A':'B'} | ${t.status} | ${t.execution} | [${t.hash}](${base}/tx/${t.hash}) |`):['No supplemental run loaded.']),
'','## Sources','',
'Public Sourcify records were fetched from exact Sepolia chain/address endpoints. Raw response SHA-256 values were bound into assessment arguments.',
'',...Object.entries(r.sources).map(([name,s])=>`- ${name}: [${s.address}](${s.url}); ${s.bytes} bytes; SHA-256 \`${s.sha256}\`.`),
'','## Scope and remaining verification','',
`Machine evidence with exact arguments and state readbacks: [run JSON](live-evidence/studionet-${r.run}.json) and [adversarial supplement](${supplementPath.replace('docs/','')}).`,
'These runs used signed SDK transactions. A true append fixture and runtime semantic equivalence are not established by this report.',
'The positive fixture preserves the layout. Matching labels/types alone do not prove unchanged runtime meaning.',
'Negative equality snapshots in this runner cover the targeted object; they do not constitute a complete global state audit.',''];
writeFileSync('docs/LIVE_STUDIONET_EVIDENCE.md',lines.join('\n'));
const deployment={network:r.network,address:r.contract,versionReadback:r.final.version,run:r.run,transactions:transactions.length,finalized:finalized.length,assertions:assertions.length,assertionExecutions,evidence:[`docs/live-evidence/studionet-${r.run}.json`,supplementPath],deploymentTransaction:deploymentTx,sourceParity:{verified:true,evidence:'docs/SOURCE_PARITY.json',sha256:parity.localSha256},superseded:['0xCf8A601f3322c82594011ACA23185FD7F59ccB68','0x10928c59f8f693F685aB936440ce54c8167E048D','0x03BD4d9d234bEd1D9b07561a160EFd921ED35Ddd']};
writeFileSync('deployments/studionet.json',JSON.stringify(deployment,null,2)+'\n');
console.log(`Rendered ${transactions.length} tx links; ${assertions.length} passing assertions`);
