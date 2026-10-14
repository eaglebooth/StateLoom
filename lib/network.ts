import {defineChain} from "viem";
const id=Number(process.env.NEXT_PUBLIC_CHAIN_ID||61999);
const rpc=process.env.NEXT_PUBLIC_RPC_URL||"https://studio.genlayer.com/api";
const explorer=process.env.NEXT_PUBLIC_EXPLORER_URL||"https://explorer-studio.genlayer.com";
export const chain=defineChain({id,name:"GenLayer StudioNet",nativeCurrency:{name:"GEN",symbol:"GEN",decimals:18},rpcUrls:{default:{http:[rpc]}},blockExplorers:{default:{name:"GenLayer Explorer",url:explorer}}});
export {explorer};
