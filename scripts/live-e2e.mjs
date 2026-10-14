import {createHash} from "node:crypto";
import {existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {createInterface} from "node:readline";
import {createAccount,createClient} from "genlayer-js";
import {studionet} from "genlayer-js/chains";

const CONTRACT=process.argv[2];
if(!/^0x[0-9a-fA-F]{40}$/.test(CONTRACT||""))throw new Error("Usage: node scripts/live-e2e.mjs <contract> [run-id]");
const run=process.argv[3]||Date.now().toString().slice(-9);
const resume=process.argv.includes("--resume");
async function readKeys(){const rl=createInterface({input:process.stdin,terminal:false});const lines=[];return await new Promise((resolve,reject)=>{rl.on("line",line=>{const v=line.trim().replace(/^0x/,"");if(v)lines.push(v);if(lines.length===2){rl.close();resolve(lines)}});rl.on("close",()=>{if(lines.length<2)reject(new Error("Two non-deployer keys required on stdin"))})})}
const [keyA,keyB]=await readKeys();
const walletA=createAccount(`0x${keyA}`),walletB=createAccount(`0x${keyB}`);
const clientA=createClient({chain:studionet,account:walletA}),clientB=createClient({chain:studionet,account:walletB});
const CHAIN=11155111;
const fixture={
 safeOld:"0x5508c89BE3Fe14Fa6d1770aa5690681E99185346",safeNew:"0x0B3D92b913630649aD98EBC1A011E40f77d9B653",
 structural:"0x946406805023F1B268F3Cc9190EB9Ff91A566973",
 semanticOld:"0x946406805023F1B268F3Cc9190EB9Ff91A566973",semanticNew:"0x87c776691b87F6Df9fb07be9e3ECaF176319f7b7",
 unavailable:"0x000000000000000000000000000000000000dEaD"
};
const sourceUrl=a=>`https://sourcify.dev/server/v2/contract/${CHAIN}/${a}?fields=all`;
async function source(a){const response=await fetch(sourceUrl(a));const raw=Buffer.from(await response.arrayBuffer());if(response.status!==200)throw new Error(`SOURCE_${response.status}:${a}`);if(raw.length>65536)throw new Error(`SOURCE_TOO_LARGE:${a}:${raw.length}`);return {address:a,url:sourceUrl(a),bytes:raw.length,sha256:createHash("sha256").update(raw).digest("hex")}}
const sources={safeOld:await source(fixture.safeOld),safeNew:await source(fixture.safeNew),structural:await source(fixture.structural),semanticNew:await source(fixture.semanticNew)};
mkdirSync("docs/live-evidence",{recursive:true});const path=`docs/live-evidence/studionet-${run}.json`;
const report=resume&&existsSync(path)?JSON.parse(readFileSync(path,"utf8")):{contract:CONTRACT,network:"GenLayer StudioNet 61999",run,actors:{owner:walletA.address,guardian:walletB.address,deployerRole:"none"},fixtures:fixture,sources,transactions:[],assertions:[],final:{}};
const save=()=>writeFileSync(path,`${JSON.stringify(report,null,2)}\n`);
const check=(condition,label,details={})=>{report.assertions.push({label,pass:Boolean(condition),details});save();if(!condition)throw new Error(`ASSERT:${label}`)};
const read=async(method,args=[])=>JSON.parse(await clientA.readContract({address:CONTRACT,functionName:method,args,transactionHashVariant:"latest-final"}));
const list=value=>Array.isArray(value)?value:value&&typeof value==="object"?Object.values(value):[];
const execution=tx=>{const leader=list(tx.consensus_data?.leader_receipt).find(x=>x?.mode==="leader")||list(tx.consensus_data?.leader_receipt)[0];if(leader?.execution_result)return leader.execution_result;if(leader?.genvm_result)return leader.genvm_result.error_code?"ERROR":"SUCCESS";const receipts=[...list(tx.consensus_data?.validators),...list(tx.consensus_data?.votes)];if(receipts.some(x=>x?.vote==="agree"&&x?.execution_result==="SUCCESS"))return "SUCCESS";if(receipts.some(x=>x?.vote==="agree"&&x?.execution_result==="ERROR"))return "ERROR";return "UNKNOWN"};
async function snapshot(method,args,client){try{if(method==="create_lineage")return await read("get_lineage",[`${client.account.address.toLowerCase()}:${args[0]}`]);if(["propose_baseline","accept_baseline"].includes(method))return await read("get_lineage",[args[0]]);if(["open_study","assess_study","activate_candidate"].includes(method)){const id=method==="open_study"?`${args[0]}:${args[2]}:${String(args[1]).toLowerCase()}`:args[0];return await read("get_study",[id])}}catch{return null}return null}
async function write(label,client,method,args,expected="SUCCESS",allowUndetermined=false){
 const before=await snapshot(method,args,client);const raw=await client.writeContract({address:CONTRACT,functionName:method,args,value:0n});const hash=typeof raw==="string"?raw:raw?.txId;process.stdout.write(`${label}: ${hash}\n`);let tx={};
 for(let i=0;i<420;i++){try{tx=await client.getTransaction({hash})}catch{await new Promise(r=>setTimeout(r,2500));continue}if(["FINALIZED","CANCELED","UNDETERMINED"].includes(tx.statusName))break;await new Promise(r=>setTimeout(r,2500))}
 const actual=execution(tx),after=await snapshot(method,args,client);report.transactions.push({label,caller:client.account.address,method,args,expected,hash,status:tx.statusName||"UNKNOWN",execution:actual,readback:{before,after}});save();if(allowUndetermined&&tx.statusName==="UNDETERMINED"){check(JSON.stringify(before)===JSON.stringify(after),`${label} undetermined preserves exact state`,{hash,before,after});return {hash,before,after,status:tx.statusName}}check(tx.statusName==="FINALIZED"&&actual===expected,`${label} finalized ${expected}`,{hash,status:tx.statusName,execution:actual});if(expected==="ERROR")check(JSON.stringify(before)===JSON.stringify(after),`${label} exact pre/post equality`,{before,after});return {hash,before,after,status:tx.statusName}
}
const version=await clientA.readContract({address:CONTRACT,functionName:"version",args:[],transactionHashVariant:"latest-final"});check(version==="stateloom/1.2.0","deployed identity",{version});
const happyLocal=`live-${run}`,happy=`${walletA.address.toLowerCase()}:${happyLocal}`;
let hs;
if(!resume){
 await write("A creates happy lineage",clientA,"create_lineage",[happyLocal,walletB.address,CHAIN]);
 await write("A proposes verified baseline",clientA,"propose_baseline",[happy,fixture.safeOld,sources.safeOld.sha256]);hs=await read("get_lineage",[happy]);
 await write("B accepts exact baseline consent",clientB,"accept_baseline",[happy,hs.consent_digest]);
 await write("A opens parallel study that will become stale",clientA,"open_study",[happy,fixture.structural,1]);
 await write("B opens safe-compatible study",clientB,"open_study",[happy,fixture.safeNew,1]);
}
const stale=`${happy}:1:${fixture.structural.toLowerCase()}`;const safeStudy=`${happy}:1:${fixture.safeNew.toLowerCase()}`;
let safe=await read("get_study",[safeStudy]);
for(let attempt=1;safe.status==="OPEN"&&attempt<=4;attempt++){await write(`B assesses safe-compatible study attempt ${attempt}`,clientB,"assess_study",[safeStudy,sources.safeOld.sha256,sources.safeNew.sha256],"SUCCESS",true);safe=await read("get_study",[safeStudy])}
check(safe.verdict==="SAFE_APPEND"&&Boolean(safe.capability_digest),"safe pair creates capability",safe);
await write("B cannot consume owner capability",clientB,"activate_candidate",[safeStudy,safe.capability_digest,1],"ERROR");
await write("wrong capability digest rejected",clientA,"activate_candidate",[safeStudy,"f".repeat(64),1],"ERROR");
await write("A activates exact capability",clientA,"activate_candidate",[safeStudy,safe.capability_digest,1]);hs=await read("get_lineage",[happy]);check(hs.epoch===2&&hs.active_implementation.toLowerCase()===fixture.safeNew.toLowerCase(),"activation advances exact address and epoch",hs);
await write("activation replay rejected",clientA,"activate_candidate",[safeStudy,safe.capability_digest,1],"ERROR");
await write("stale parallel study rejected",clientB,"assess_study",[stale,sources.safeOld.sha256,sources.structural.sha256],"ERROR");
await write("B opens structural conflict",clientB,"open_study",[happy,fixture.structural,2]);const structuralStudy=`${happy}:2:${fixture.structural.toLowerCase()}`;
await write("B assesses structural conflict",clientB,"assess_study",[structuralStudy,sources.safeNew.sha256,sources.structural.sha256]);const structural=await read("get_study",[structuralStudy]);check(structural.verdict==="STRUCTURAL_CONFLICT"&&!structural.capability_digest,"structural conflict blocks capability",structural);
await write("A opens unavailable source",clientA,"open_study",[happy,fixture.unavailable,2]);const unavailableStudy=`${happy}:2:${fixture.unavailable.toLowerCase()}`;
await write("B assesses unavailable source",clientB,"assess_study",[unavailableStudy,sources.safeNew.sha256,"e".repeat(64)]);const unavailable=await read("get_study",[unavailableStudy]);check(unavailable.verdict==="UNRESOLVED"&&!unavailable.capability_digest,"unavailable source fails closed",unavailable);
const semanticLocal=`semantic-${run}`,semanticLineage=`${walletA.address.toLowerCase()}:${semanticLocal}`;
await write("A creates semantic-control lineage",clientA,"create_lineage",[semanticLocal,walletB.address,CHAIN]);
await write("A proposes semantic baseline",clientA,"propose_baseline",[semanticLineage,fixture.semanticOld,sources.structural.sha256]);let ss=await read("get_lineage",[semanticLineage]);
await write("B accepts semantic baseline",clientB,"accept_baseline",[semanticLineage,ss.consent_digest]);
await write("B opens semantic repurpose",clientB,"open_study",[semanticLineage,fixture.semanticNew,1]);const semanticStudy=`${semanticLineage}:1:${fixture.semanticNew.toLowerCase()}`;
await write("B assesses semantic repurpose",clientB,"assess_study",[semanticStudy,sources.structural.sha256,sources.semanticNew.sha256]);const semantic=await read("get_study",[semanticStudy]);check(semantic.verdict==="SEMANTIC_RISK"&&!semantic.capability_digest,"semantic repurpose blocks capability",semantic);
const guardLocal=`guard-${run}`,guard=`${walletA.address.toLowerCase()}:${guardLocal}`;
await write("A creates role-control lineage",clientA,"create_lineage",[guardLocal,walletB.address,CHAIN]);
await write("B cannot propose owner baseline",clientB,"propose_baseline",[guard,fixture.safeOld,sources.safeOld.sha256],"ERROR");
report.final={version,happy:await read("get_lineage",[happy]),safe:await read("get_study",[safeStudy]),structural,unavailable,semantic,roleControl:await read("get_lineage",[guard])};save();
process.stdout.write(`EVIDENCE ${path}\n`);
