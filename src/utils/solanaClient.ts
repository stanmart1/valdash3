import { Connection } from "@solana/web3.js";

const selectedNetwork = (typeof window !== 'undefined' ? localStorage.getItem('selectedNetwork') : null) || import.meta.env.VITE_SOLANA_NETWORK || 'devnet';

const getRpcEndpoints = (network: string) => {
  switch (network) {
    case 'mainnet-beta':
      return [
        'https://solana-mainnet.g.alchemy.com/v2/demo',
        'https://rpc.ankr.com/solana'
      ];
    case 'testnet':
      return [
        'https://api.testnet.solana.com'
      ];
    default:
      return [
        'https://api.devnet.solana.com'
      ];
  }
};

const createConnection = () => {
  const customRpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;
  if (customRpcUrl) {
    return new Connection(customRpcUrl, "confirmed");
  }
  
  const endpoints = getRpcEndpoints(selectedNetwork);
  return new Connection(endpoints[0], "confirmed");
};

export const connection = createConnection();

// Fallback connection helper
export const createFallbackConnection = (network: string = selectedNetwork) => {
  const endpoints = getRpcEndpoints(network);
  // Use second endpoint as fallback
  return new Connection(endpoints[1] || endpoints[0], "confirmed");
};