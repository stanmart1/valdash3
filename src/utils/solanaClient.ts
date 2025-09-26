import { Connection } from "@solana/web3.js";

const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const connection = new Connection(rpcUrl, "confirmed");