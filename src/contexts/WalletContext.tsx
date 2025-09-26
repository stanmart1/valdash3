import { ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
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
  const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || getRpcUrl(selectedNetwork);
  const wallets = [
    new SolflareWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};