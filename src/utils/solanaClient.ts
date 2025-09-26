import { Connection } from "@solana/web3.js";

const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://devnet.helius-rpc.com/?api-key=demo';

export const connection = new Connection(rpcUrl, "confirmed");