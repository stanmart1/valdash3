import { Connection, clusterApiUrl } from "@solana/web3.js";

const selectedNetwork = (typeof window !== 'undefined' ? localStorage.getItem('selectedNetwork') : null) || import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
const network = selectedNetwork as 'devnet' | 'testnet' | 'mainnet-beta';
const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network);

export const connection = new Connection(rpcUrl, "confirmed");