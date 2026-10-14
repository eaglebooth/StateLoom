import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"StateLoom · implementation lineage",description:"Consensus-verified storage lineage for upgradeable Web3 systems"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
