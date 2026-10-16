// Honor StudioNet's explicit retry-after hint; never change endpoints to evade it.
export async function withRateLimit(action){
 for(let attempt=0;attempt<6;attempt++){
  try{return await action()}catch(error){
   let current=error,rate=null;
   for(let depth=0;current&&depth<8;depth++,current=current.cause){
    if(current.code===-32029||String(current.message||'').includes('Rate limit exceeded'))rate=current;
    if(current.data?.retry_after_seconds){rate=current;break}
   }
   if(!rate||attempt===5)throw error;
   const seconds=Number(rate.data?.retry_after_seconds)||60;
   process.stdout.write(`RPC rate limit: waiting ${seconds+2}s before retry\n`);
   let remaining=(seconds+2)*1000;
   while(remaining>0){const interval=Math.min(remaining,30000);await new Promise(resolve=>setTimeout(resolve,interval));remaining-=interval}
  }
 }
 throw new Error('RPC rate-limit retries exhausted');
}
