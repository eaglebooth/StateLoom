const SAFE_READS=new Set(['gen_call','eth_call','eth_getTransactionCount','eth_getTransactionByHash','eth_getTransactionReceipt','eth_estimateGas','eth_gasPrice','eth_getBalance','eth_blockNumber','eth_chainId']);
let installed=false;
export function installRpcReadRetries(){
 if(installed)return;installed=true;
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async(input,options)=>{
  let safe=false;
  if(String(input)==='https://studio.genlayer.com/api'){
   try{safe=SAFE_READS.has(JSON.parse(options?.body||'{}').method)}catch{safe=false}
  }
  for(let attempt=0;attempt<3;attempt++){
   try{return await originalFetch(input,options)}catch(error){
    if(!safe||attempt===2)throw error;
    process.stdout.write(`Transient RPC read failure; retry ${attempt+1}/2\n`);
    await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
   }
  }
  throw new Error('RPC read unavailable');
 };
}
