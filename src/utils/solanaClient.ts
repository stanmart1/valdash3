import { Connection } from "@solana/web3.js";

const selectedNetwork = (typeof window !== 'undefined' ? localStorage.getItem('selectedNetwork') : null) || import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
const getRpcUrl = (network: string) => {
  switch (network) {
    case 'mainnet-beta':
      return 'https://mainnet.helius-rpc.com/?api-key=demo';
    case 'testnet':
      return 'https://testnet.helius-rpc.com/?api-key=demo';
    default:
      return 'https://devnet.helius-rpc.com/?api-key=demo';
  }
};
const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || getRpcUrl(selectedNetwork);

export const connection = new Connection(rpcUrl, "confirmed");