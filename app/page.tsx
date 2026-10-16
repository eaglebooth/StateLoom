"use client";
import Image from "next/image";
import {useCallback,useEffect,useMemo,useState} from "react";
import {ArrowUpRight,ChevronRight,Database,GitBranch,Link2,LockKeyhole,RefreshCw,ShieldCheck,Wallet} from "lucide-react";
import {connect,current,readJson,transact,validAddress,watch} from "@/lib/chain";
import {explorer,stateLoomContract} from "@/lib/network";

type Data=Record<string,unknown>;
const short=(v:string)=>v?(v.length>18?`${v.slice(0,6)}…${v.slice(-4)}`:v):"not connected";
const asString=(v:unknown)=>String(v??"");
const asNumber=(v:unknown)=>Number(v??0);

export default function Home(){
 const [account,setAccount]=useState("");
 const [contract,setContract]=useState(stateLoomContract);
 const [lineageId,setLineageId]=useState("");
 const [studyId,setStudyId]=useState("");
 const [lineage,setLineage]=useState<Data|null>(null);
 const [study,setStudy]=useState<Data|null>(null);
 const [localId,setLocalId]=useState("core-vault");
 const [guardian,setGuardian]=useState("");
 const [chainId,setChainId]=useState("11155111");
 const [implementation,setImplementation]=useState("");
 const [digest,setDigest]=useState("");
 const [candidate,setCandidate]=useState("");
 const [oldDigest,setOldDigest]=useState("");
 const [newDigest,setNewDigest]=useState("");
 const [busy,setBusy]=useState("");
 const [message,setMessage]=useState("Connect a wallet to begin a new lineage.");
 const [txHash,setTxHash]=useState("");
 useEffect(()=>{current().then(setAccount);return watch(setAccount)},[]);
 const refresh=useCallback(async()=>{try{setBusy("sync");if(!validAddress(contract)||!lineageId)throw new Error("Set a valid contract and lineage ID");const x=await readJson(contract,"get_lineage",[lineageId]);const s=studyId?await readJson(contract,"get_study",[studyId]):null;if(s&&s.lineage_id!==lineageId)throw new Error("Study belongs to a different lineage");setLineage(x);setStudy(s);setMessage("Authoritative latest-final state synchronized.")}catch(e){setLineage(null);setStudy(null);setMessage(e instanceof Error?e.message:String(e))}finally{setBusy("")}},[contract,lineageId,studyId]);
 const run=async(label:string,method:string,args:(string|number)[],verify?:()=>Promise<void>)=>{try{setBusy(label);setTxHash("");setMessage(`${label}: awaiting wallet`);const hash=await transact(contract,account,method,args,s=>setMessage(`${label}: ${s.toLowerCase()}`));if(verify)await verify();else{
  const id=String(args[0]);
  if(method==="propose_baseline"||method==="accept_baseline"){
   const x=await readJson(contract,"get_lineage",[id]);
   if(x.lineage_id!==id)throw new Error("Lineage readback mismatch");
   if(method==="propose_baseline"&&(x.status!=="BASELINE_PROPOSED"||asString(x.active_implementation)!==String(args[1]).toLowerCase()||x.active_record_digest!==args[2]))throw new Error("Baseline post-state mismatch");
   if(method==="accept_baseline"&&(x.status!=="ACTIVE"||asNumber(x.epoch)!==1))throw new Error("Consent post-state mismatch");
   setLineage(x);
  }else{
   const x=await readJson(contract,"get_study",[id]);
   if(x.study_id!==id)throw new Error("Study readback mismatch");
   if(method==="assess_study"&&(x.status!=="ASSESSED"||x.old_record_digest!==args[1]||x.new_record_digest!==args[2]))throw new Error("Assessment post-state mismatch");
   if(method==="activate_candidate"){
    const l=await readJson(contract,"get_lineage",[String(x.lineage_id)]);
    if(x.status!=="CONSUMED"||x.consumed!==true||asNumber(l.epoch)!==Number(args[2])+1||l.active_implementation!==x.candidate)throw new Error("Activation post-state mismatch");
    setLineage(l);
   }
   setStudy(x);
  }
 }setMessage(`${label}: finalized and verified by readback`);setTxHash(hash)}catch(e){setTxHash("");setMessage(e instanceof Error?e.message:String(e))}finally{setBusy("")}};
 const create=async()=>run("Create lineage","create_lineage",[localId,guardian,Number(chainId)],async()=>{const id=`${account.toLowerCase()}:${localId}`;const x=await readJson(contract,"get_lineage",[id]);if(asString(x.owner).toLowerCase()!==account.toLowerCase())throw new Error("Readback owner mismatch");setLineageId(id);setLineage(x)});
 const openStudy=async()=>run("Open study","open_study",[lineageId,candidate,asNumber(lineage?.epoch)],async()=>{const id=`${lineageId}:${asNumber(lineage?.epoch)}:${candidate.toLowerCase()}`;const x=await readJson(contract,"get_study",[id]);if(asString(x.candidate).toLowerCase()!==candidate.toLowerCase())throw new Error("Readback candidate mismatch");setStudyId(id);setStudy(x)});
 const slots=useMemo(()=>{try{return JSON.parse(asString(study?.findings||"[]")) as Data[]}catch{return[]}},[study]);
 const status=asString(study?.status==="OPEN"?"OPEN":study?.status==="CONSUMED"?"CONSUMED":study?.verdict||lineage?.status||"UNBOUND");
 const isOwner=!!account&&lineage?.lineage_id===lineageId&&asString(lineage?.owner).toLowerCase()===account.toLowerCase();
 const isGuardian=!!account&&lineage?.lineage_id===lineageId&&asString(lineage?.guardian).toLowerCase()===account.toLowerCase();
 const isParticipant=isOwner||isGuardian;
 const assessmentReady=isParticipant&&lineage?.status==="ACTIVE"&&study?.lineage_id===lineageId&&study?.study_id===studyId&&study?.status==="OPEN"&&asNumber(study?.expected_epoch)===asNumber(lineage?.epoch);
 const activationReady=isOwner&&study?.lineage_id===lineageId&&study?.verdict==="SAFE_APPEND"&&study?.status==="ASSESSED"&&study?.consumed!==true&&Boolean(study?.capability_digest)&&asNumber(study?.expected_epoch)===asNumber(lineage?.epoch);
 return <main>
  <header className="mast"><div className="brand"><Image src="/stateloom-logo.png" alt="StateLoom" width={52} height={52} priority/><div><b>STATELOOM</b><span>IMPLEMENTATION LINEAGE / STUDIONET</span></div></div><button className="wallet" disabled={!!busy} onClick={async()=>{try{setAccount(await connect())}catch(e){setMessage(e instanceof Error?e.message:String(e))}}}><Wallet size={16}/>{short(account)}</button></header>
  <section className="hero"><div className="eyebrow"><ShieldCheck size={15}/> CONSENSUS-GATED STORAGE CONTINUITY</div><h1>Trace what state<br/><i>still means.</i></h1><p>Bind deployed implementations to verified source, inspect every occupied slot, and advance a lineage only after deterministic and semantic checks agree.</p><div className="statusline"><span className={`lamp ${status.toLowerCase()}`}/><b>{status.replaceAll("_"," ")}</b><small>{message}</small></div></section>
  <section className="workbench">
   <aside className="control"><div className="section-label">01 / CONTROL PLANE</div><label>STATELOOM CONTRACT<input disabled={!!busy} value={contract} onChange={e=>{setContract(e.target.value);setLineage(null);setStudy(null);setTxHash("")}} placeholder="0x…"/></label><label>LINEAGE ID<input disabled={!!busy} value={lineageId} onChange={e=>{setLineageId(e.target.value);setLineage(null);setStudy(null);setStudyId("");setTxHash("")}} placeholder="owner:local-id"/></label><label>STUDY ID<input disabled={!!busy} value={studyId} onChange={e=>{setStudyId(e.target.value);setStudy(null);setTxHash("")}} placeholder="lineage:epoch:candidate"/></label><button className="sync" onClick={refresh} disabled={!lineageId||!!busy}><RefreshCw size={15}/> Sync authoritative state</button><div className="rule"/><Key label="Owner" value={asString(lineage?.owner)||account}/><Key label="Guardian" value={asString(lineage?.guardian)||"not bound"}/><Key label="Epoch" value={asString(lineage?.epoch)||"0"}/><Key label="Active" value={asString(lineage?.active_implementation)||"none"}/>{txHash&&<a className="tx" href={`${explorer}/tx/${txHash}`} target="_blank">Finalized transaction <ArrowUpRight size={13}/></a>}</aside>
   <div className="loom"><div className="loom-head"><div><div className="section-label">02 / STORAGE LOOM</div><h2>Occupied state ancestry</h2></div><div className="legend"><span><i className="safe"/>preserved</span><span><i className="append"/>append</span><span><i className="risk"/>risk</span></div></div>
    <div className="columns"><span>ACTIVE IMPLEMENTATION</span><span>SLOT / OFFSET</span><span>CANDIDATE IMPLEMENTATION</span></div>
    <div className="slot-list">{slots.length?slots.map((s,i)=><div className="slot" key={i}><div><b>{asString(s.old_label)||"occupied"}</b><small>{asString(s.old_type)}</small></div><div className="spine"><i/><em>{asString(s.slot)}:{asString(s.offset)}</em><i/></div><div><b>{asString(s.new_label)||"—"}</b><small>{asString(s.relation)||asString(s.new_type)}</small></div></div>):[0,1,2,3].map(i=><div className="slot ghost" key={i}><div><b>slot awaiting proof</b><small>verified layout A</small></div><div className="spine"><i/><em>{i}:0</em><i/></div><div><b>candidate unresolved</b><small>verified layout B</small></div></div>)}</div>
    <div className="verdict"><div><span>CONSENSUS VERDICT</span><strong>{study?.status==="OPEN"?"NOT ASSESSED":asString(study?.verdict||"NOT ASSESSED").replaceAll("_"," ")}</strong></div><p>{asString(study?.risk_codes)||"No consequential claim is shown until the transaction is finalized and exact state is read back."}</p></div>
   </div>
   <aside className="actions"><div className="section-label">03 / PROTOCOL ACTIONS</div><Action title="Create a lineage" icon={<GitBranch size={17}/>}><input value={localId} onChange={e=>setLocalId(e.target.value)} placeholder="local id"/><input value={guardian} onChange={e=>setGuardian(e.target.value)} placeholder="guardian 0x…"/><input value={chainId} onChange={e=>setChainId(e.target.value)} placeholder="source chain id"/><button disabled={!!busy||!account} onClick={create}>Create <ChevronRight size={15}/></button></Action>
    <Action title="Bind baseline" icon={<Database size={17}/>}><input value={implementation} onChange={e=>setImplementation(e.target.value)} placeholder="implementation 0x…"/><input value={digest} onChange={e=>setDigest(e.target.value)} placeholder="Sourcify record sha256"/><button disabled={!!busy||!isOwner||lineage?.status!=="DRAFT"} onClick={()=>run("Propose baseline","propose_baseline",[lineageId,implementation,digest])}>Owner proposes</button><button disabled={!!busy||!isGuardian||lineage?.status!=="BASELINE_PROPOSED"} onClick={()=>run("Accept baseline","accept_baseline",[lineageId,asString(lineage?.consent_digest)])}>Guardian accepts</button></Action>
    <Action title="Study candidate" icon={<Link2 size={17}/>}><input value={candidate} onChange={e=>setCandidate(e.target.value)} placeholder="candidate 0x…"/><button disabled={!!busy||!isParticipant||lineage?.status!=="ACTIVE"} onClick={openStudy}>Open at epoch {asNumber(lineage?.epoch)}</button><input value={oldDigest} onChange={e=>setOldDigest(e.target.value)} placeholder="active record sha256"/><input value={newDigest} onChange={e=>setNewDigest(e.target.value)} placeholder="candidate record sha256"/><button disabled={!!busy||!assessmentReady} onClick={()=>run("Assess study","assess_study",[studyId,oldDigest,newDigest])}>Run consensus</button><small>Only the lineage owner or guardian can assess an open study.</small><button className="activate" disabled={!!busy||!activationReady} onClick={()=>run("Activate candidate","activate_candidate",[studyId,asString(study?.capability_digest),asNumber(lineage?.epoch)])}><LockKeyhole size={15}/> Activate verified lineage</button></Action></aside>
  </section>
  <footer><span>Source-bound · fail-closed · replay-safe</span><span>Deployer has no protocol authority. Any wallet may create its own lineage.</span></footer>
 </main>
}
function Key({label,value}:{label:string,value:string}){return <div className="key"><span>{label}</span><code title={value}>{short(value)}</code></div>}
function Action({title,icon,children}:{title:string,icon:React.ReactNode,children:React.ReactNode}){return <details open><summary>{icon}<span>{title}</span><ChevronRight size={14}/></summary><div className="action-body">{children}</div></details>}
