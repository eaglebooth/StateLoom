import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {installRpcReadRetries} from '../scripts/rpc-read-retries.mjs';
const originalFetch=globalThis.fetch;
let handler;
globalThis.fetch=(...args)=>handler(...args);
installRpcReadRetries();
after(()=>{globalThis.fetch=originalFetch});

test('a transient read failure retries the exact same RPC request',async()=>{
 let calls=0;
 const options={method:'POST',body:JSON.stringify({method:'gen_call',params:[]})};
 handler=async(url,actual)=>{assert.equal(url,'https://studio.genlayer.com/api');assert.equal(actual,options);if(++calls<3)throw new TypeError('fetch failed');return new Response('{"result":"ok"}')};
 const response=await fetch('https://studio.genlayer.com/api',options);
 assert.equal((await response.json()).result,'ok');assert.equal(calls,3);
});

test('an ambiguous raw-transaction submission failure is never automatically resent',async()=>{
 let calls=0;
 handler=async()=>{calls++;throw new TypeError('fetch failed')};
 await assert.rejects(fetch('https://studio.genlayer.com/api',{method:'POST',body:JSON.stringify({method:'eth_sendRawTransaction',params:['0x00']})}),/fetch failed/);
 assert.equal(calls,1);
});
