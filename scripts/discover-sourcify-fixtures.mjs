import {createHash} from "node:crypto";
const chain=process.argv[2]||"11155111";
const limit=Number(process.argv[3]||200);
const base="https://sourcify.dev/server/v2";
const list=await (await fetch(`${base}/contracts/${chain}?limit=${limit}&sort=desc`)).json();
const records=[];
for(let i=0;i<list.results.length;i+=10){
 const chunk=list.results.slice(i,i+10);
 const found=await Promise.all(chunk.map(async row=>{
  try{
   const url=`${base}/contract/${chain}/${row.address}?fields=storageLayout`;
   const data=await (await fetch(url)).json();
   const layout=data.storageLayout;
   if(!layout?.storage?.length||!layout?.types)return null;
   const slots=layout.storage.map(x=>{const t=layout.types[x.type]||{};return {slot:Number(x.slot),offset:Number(x.offset),width:Number(t.numberOfBytes),type:x.type,encoding:t.encoding,label:x.label,typeLabel:t.label}}).sort((a,b)=>a.slot-b.slot||a.offset-b.offset);
   if(!slots.length||slots.length>32)return null;
   const structure=slots.map(({slot,offset,width,type,encoding})=>({slot,offset,width,type,encoding}));
   return {address:row.address,match:row.match,slots,structureHash:createHash("sha256").update(JSON.stringify(structure)).digest("hex"),fullHash:createHash("sha256").update(JSON.stringify(slots)).digest("hex")};
  }catch{return null}
 }));
 records.push(...found.filter(Boolean));
}
const identical=[]; const semantic=[];
for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
 if(records[i].fullHash===records[j].fullHash)identical.push([records[i],records[j]]);
 else if(records[i].structureHash===records[j].structureHash)semantic.push([records[i],records[j]]);
}
const compact=process.argv.includes("--compact");
const eligible=process.argv.includes("--eligible");
const pair=x=>x.map(r=>({address:r.address,labels:r.slots.map(s=>`${s.slot}:${s.offset}:${s.label}:${s.typeLabel}`)}));
let summary;
if(eligible){
 const groups=[...identical.map(x=>({kind:"identical",pair:x})),...semantic.map(x=>({kind:"semantic",pair:x}))];
 const out=[];
 for(const group of groups.slice(0,80)){
  const enriched=[];
  for(const record of group.pair){
   const response=await fetch(`${base}/contract/${chain}/${record.address}?fields=all`);
   const raw=Buffer.from(await response.arrayBuffer());
   enriched.push({address:record.address,bytes:raw.length,sha256:createHash("sha256").update(raw).digest("hex"),labels:record.slots.map(s=>`${s.slot}:${s.offset}:${s.label}:${s.typeLabel}`)});
  }
  if(enriched.every(x=>x.bytes<=65536))out.push({kind:group.kind,pair:enriched});
  if(out.length>=12)break;
 }
 summary={chain,scanned:list.results.length,withLayout:records.length,eligible:out};
}else if(compact)summary={
 chain,scanned:list.results.length,withLayout:records.length,
 identical:identical.slice(0,10).map(pair),
 semantic:semantic.slice(0,20).map(pair),
 structural:records.slice(0,10).map(r=>({address:r.address,labels:r.slots.map(s=>`${s.slot}:${s.offset}:${s.label}:${s.typeLabel}`)}))
};else summary={chain,scanned:list.results.length,withLayout:records.length,identical:identical.slice(0,10),semantic:semantic.slice(0,10),structural:records.slice(0,10)};
console.log(JSON.stringify(summary,null,2));
