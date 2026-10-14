import {mkdirSync,writeFileSync} from "node:fs";
import {createInterface} from "node:readline";
import {createAccount,createClient} from "genlayer-js";
import {studionet} from "genlayer-js/chains";

const CONTRACT=process.argv[2];
if(!/^0x[0-9a-fA-F]{40}$/.test(CONTRACT||""))throw new Error("Usage: node scripts/live-adversarial.mjs <contract> [run-id]");
const run=process.argv[3]||Date.now().toString().slice(-9);
async function readKeys(){const rl=createInterface({input:process.stdin,terminal:false});const lines=[];return await new Promise((resolve,reject)=>{rl.on("line",line=>{const value=line.trim().replace(/^0x/,"");if(value)lines.push(value);if(lines.length===2){rl.close();resolve(lines)}});rl.on("close",()=>{if(lines.length<2)reject(new Error("Two non-deployer keys required on stdin"))})})}
const [keyA,keyB]=await readKeys();
const walletA=createAccount(`0x${keyA}`),walletB=createAccount(`0x${keyB}`);
const clientA=createClient({chain:studionet,account:walletA}),clientB=createClient({chain:studionet,account:walletB});
const CHAIN=11155111;
const oldAddress="0x5508c89BE3Fe14Fa6d1770aa5690681E99185346";
const newAddress="0x0B3D92b913630649aD98EBC1A011E40f77d9B653";
const oldDigest="3af2d10d67f4767c7f1d7f509dba7c5a7b55bfba45f2294eda180e951331242c";
const newDigest="eee601513cb8f3fd379acdddcf89ca05b67d28564abe2ee77b14bd49752509a3";
const foreignCapability="7b0f2fe4929d69c0060136a4248a9d008edb44759f829949d3721630bcda6860";
const report={contract:CONTRACT,network:"GenLayer StudioNet 61999",run,actors:{owner:walletA.address,guardian:walletB.address,deployerRole:"none"},controls:["wrong-old-record-digest","fetched-new-content-digest-mismatch","cross-lineage-capability"],transactions:[],assertions:[],final:{}};
mkdirSync("docs/live-evidence",{recursive:true});const path=`docs/live-evidence/studionet-adversarial-${run}.json`;
const save=()=>writeFileSync(path,`${JSON.stringify(report,null,2)}\n`);
const check=(condition,label,details={})=>{report.assertions.push({label,pass:Boolean(condition),details});save();if(!condition)throw new Error(`ASSERT:${label}`)};
const read=async(method,args=[])=>JSON.parse(await clientA.readContract({address:CONTRACT,functionName:method,args,transactionHashVariant:"latest-final"}));
const list=value=>Array.isArray(value)?value:value&&typeof value==="object"?Object.values(value):[];
const execution=tx=>{const leader=list(tx.consensus_data?.leader_receipt).find(x=>x?.mode==="leader")||list(tx.consensus_data?.leader_receipt)[0];if(leader?.execution_result)return leader.execution_result;if(leader?.genvm_result)return leader.genvm_result.error_code?"ERROR":"SUCCESS";return "UNKNOWN"};
async function snapshot(method,args,client){try{if(method==="create_lineage")return await read("get_lineage",[`${client.account.address.toLowerCase()}:${args[0]}`]);if(["propose_baseline","accept_baseline"].includes(method))return await read("get_lineage",[args[0]]);if(["open_study","assess_study","activate_candidate"].includes(method)){const id=method==="open_study"?`${args[0]}:${args[2]}:${String(args[1]).toLowerCase()}`:args[0];return await read("get_study",[id])}}catch{return null}return null}
async function write(label,client,method,args,expected="SUCCESS",allowUndetermined=false){const before=await snapshot(method,args,client);const raw=await client.writeContract({address:CONTRACT,functionName:method,args,value:0n});const hash=typeof raw==="string"?raw:raw?.txId;process.stdout.write(`${label}: ${hash}\n`);let tx={};for(let i=0;i<420;i++){try{tx=await client.getTransaction({hash})}catch{await new Promise(r=>setTimeout(r,2500));continue}if(["FINALIZED","CANCELED","UNDETERMINED"].includes(tx.statusName))break;await new Promise(r=>setTimeout(r,2500))}const actual=execution(tx),after=await snapshot(method,args,client);report.transactions.push({label,caller:client.account.address,method,args,expected,hash,status:tx.statusName||"UNKNOWN",execution:actual,readback:{before,after}});save();if(allowUndetermined&&tx.statusName==="UNDETERMINED"){check(JSON.stringify(before)===JSON.stringify(after),`${label} undetermined preserves exact state`,{hash});return false}check(tx.statusName==="FINALIZED"&&actual===expected,`${label} finalized ${expected}`,{hash,status:tx.statusName,execution:actual});if(expected==="ERROR")check(JSON.stringify(before)===JSON.stringify(after),`${label} exact pre/post equality`,{before,after});return true}

const version=await clientA.readContract({address:CONTRACT,functionName:"version",args:[],transactionHashVariant:"latest-final"});
check(version==="stateloom/1.2.0","exact deployed identity",{version});

const integrityLocal=`integrity-${run}`,integrity=`${walletA.address.toLowerCase()}:${integrityLocal}`;
await write("A creates integrity-control lineage",clientA,"create_lineage",[integrityLocal,walletB.address,CHAIN]);
await write("A proposes integrity baseline",clientA,"propose_baseline",[integrity,oldAddress,oldDigest]);
let lineage=await read("get_lineage",[integrity]);
await write("B accepts integrity baseline",clientB,"accept_baseline",[integrity,lineage.consent_digest]);
await write("B opens digest-control study",clientB,"open_study",[integrity,newAddress,1]);
const integrityStudy=`${integrity}:1:${newAddress.toLowerCase()}`;
await write("wrong old record digest is rejected",clientB,"assess_study",[integrityStudy,"0".repeat(64),newDigest],"ERROR");
await write("fetched new content digest mismatch fails closed",clientB,"assess_study",[integrityStudy,oldDigest,"e".repeat(64)]);
const unresolved=await read("get_study",[integrityStudy]);
check(unresolved.status==="ASSESSED"&&unresolved.verdict==="UNRESOLVED"&&!unresolved.capability_digest,"digest mismatch cannot create positive capability",unresolved);

const crossLocal=`cross-${run}`,cross=`${walletA.address.toLowerCase()}:${crossLocal}`;
await write("A creates cross-lineage control",clientA,"create_lineage",[crossLocal,walletB.address,CHAIN]);
await write("A proposes cross-lineage baseline",clientA,"propose_baseline",[cross,oldAddress,oldDigest]);
lineage=await read("get_lineage",[cross]);
await write("B accepts cross-lineage baseline",clientB,"accept_baseline",[cross,lineage.consent_digest]);
await write("B opens cross-lineage safe study",clientB,"open_study",[cross,newAddress,1]);
const crossStudy=`${cross}:1:${newAddress.toLowerCase()}`;
let safe=await read("get_study",[crossStudy]);
for(let attempt=1;safe.status==="OPEN"&&attempt<=4;attempt++){await write(`B assesses cross-lineage safe study attempt ${attempt}`,clientB,"assess_study",[crossStudy,oldDigest,newDigest],"SUCCESS",true);safe=await read("get_study",[crossStudy])}
check(safe.status==="ASSESSED"&&safe.verdict==="SAFE_APPEND"&&Boolean(safe.capability_digest),"control study has its own bound capability",safe);
await write("foreign lineage capability is rejected",clientA,"activate_candidate",[crossStudy,foreignCapability,1],"ERROR");
await write("exact bound capability still activates",clientA,"activate_candidate",[crossStudy,safe.capability_digest,1]);
lineage=await read("get_lineage",[cross]);
safe=await read("get_study",[crossStudy]);
check(lineage.epoch===2&&safe.status==="CONSUMED"&&safe.consumed===true,"cross control closes with exact capability only",{lineage,safe});
report.final={version,integrity:await read("get_lineage",[integrity]),digestMismatch:unresolved,cross:lineage,crossStudy:safe};save();
process.stdout.write(`EVIDENCE ${path}\n`);
