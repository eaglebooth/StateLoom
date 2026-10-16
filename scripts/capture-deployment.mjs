import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {writeFileSync} from 'node:fs';
import {withRateLimit} from './rpc-rate-limit.mjs';
const address=process.argv[2],hash=process.argv[3];
if(!/^0x[0-9a-fA-F]{40}$/.test(address||'')||!/^0x[0-9a-fA-F]{64}$/.test(hash||''))throw new Error('address and deployment transaction required');
const c=createClient({chain:studionet});
const tx=await withRateLimit(()=>c.getTransaction({hash}));
const list=v=>Array.isArray(v)?v:v&&typeof v==='object'?Object.values(v):[];
const leader=list(tx.consensus_data?.leader_receipt).find(x=>x.mode==='leader')||list(tx.consensus_data?.leader_receipt)[0];
const report={address,hash,checkedAt:new Date().toISOString(),status:tx.statusName,
 from:tx.from_address||tx.from,to:tx.to_address||tx.to,contractAddress:tx.contract_address,
 execution:leader?.execution_result,result:leader?.result,errorCode:leader?.genvm_result?.error_code||null};
writeFileSync('docs/DEPLOYMENT_RECEIPT.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if(report.status!=='FINALIZED'||report.execution!=='SUCCESS')throw new Error('Deployment did not finalize successfully');
