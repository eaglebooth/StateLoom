import {readFileSync,writeFileSync} from 'node:fs';
import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {withRateLimit} from './rpc-rate-limit.mjs';
import {installRpcReadRetries} from './rpc-read-retries.mjs';
installRpcReadRetries();
const files=process.argv.slice(2);
if(!files.length)throw new Error('Supply finalized machine evidence files');
const c=createClient({chain:studionet});
const list=v=>Array.isArray(v)?v:v&&typeof v==='object'?Object.values(v):[];
for(const file of files){
 const report=JSON.parse(readFileSync(file,'utf8'));
 if(!report.final?.version||report.assertions.some(x=>!x.pass))throw new Error(`Incomplete/failed run: ${file}`);
 const receipts=[];
 for(const t of report.transactions){
  const tx=await withRateLimit(()=>c.getTransaction({hash:t.hash}));
  const leader=list(tx.consensus_data?.leader_receipt).find(x=>x.mode==='leader')||list(tx.consensus_data?.leader_receipt)[0];
  if(tx.statusName!==t.status||leader?.execution_result!==t.execution)throw new Error(`Receipt mismatch: ${t.hash}`);
  const receipt={hash:t.hash,status:tx.statusName,execution:leader?.execution_result,
   errorCode:leader?.genvm_result?.error_code||null,errorDescription:leader?.genvm_result?.error_description||null,
   result:leader?.result,votes:tx.consensus_data?.votes};
  if(t.label.startsWith('outsider ')){
   if(!JSON.stringify(receipt).includes('PARTICIPANT_ONLY'))throw new Error(`Outsider rejection reason is not PARTICIPANT_ONLY: ${t.hash}`);
   if(!t.readback.before?.study||!t.readback.before?.lineage||JSON.stringify(t.readback.before)!==JSON.stringify(t.readback.after))throw new Error(`Missing outsider state equality: ${t.hash}`);
  }
  receipts.push(receipt);
 }
 const output=file.replace(/\.json$/,'.receipts.json');
 writeFileSync(output,JSON.stringify({contract:report.contract,checkedAt:new Date().toISOString(),sourceReport:file,verified:receipts.length,receipts},null,2)+'\n');
 console.log(`${output}: ${receipts.length} verified receipts`);
}
