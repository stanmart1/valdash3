import { Connection, clusterApiUrl } from "@solana/web3.js";

const network = (import.meta.env.VITE_SOLANA_NETWORK || 'devnet') as 'devnet' | 'testnet' | 'mainnet-beta';
const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network);

export const connection = new Connection(rpcUrl, "confirmed");