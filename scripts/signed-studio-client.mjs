import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';

// Use the same provider-backed SDK path as the browser. Signing remains local.
// StudioNet returns a transaction ID directly; avoid redundant EVM-receipt polling.
export function signedStudioClient(account){
 const rpc=createClient({chain:studionet});
 const provider={request:async({method,params=[]})=>{
  if(method==='eth_chainId')return `0x${studionet.id.toString(16)}`;
  if(method==='eth_accounts'||method==='eth_requestAccounts')return [account.address];
  if(method!=='eth_sendTransaction')throw new Error(`Unsupported signer method: ${method}`);
  const tx=params[0];
  if(tx.from?.toLowerCase()!==account.address.toLowerCase())throw new Error('Signer mismatch');
  if(BigInt(tx.chainId)!==BigInt(studionet.id))throw new Error('Signer chain mismatch');
  const serializedTransaction=await account.signTransaction({
   to:tx.to,data:tx.data,value:BigInt(tx.value||0),gas:BigInt(tx.gas),
   gasPrice:BigInt(tx.gasPrice||0),nonce:Number(BigInt(tx.nonce)),
   chainId:studionet.id,type:'legacy',
  });
  return rpc.sendRawTransaction({serializedTransaction});
 }};
 return createClient({chain:studionet,account:account.address,provider});
}
