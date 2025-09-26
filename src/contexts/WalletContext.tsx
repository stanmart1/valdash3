import { ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
  // Force devnet to avoid 403 errors on mainnet
  let selectedNetwork = (typeof window !== 'undefined' ? localStorage.getItem('selectedNetwork') : null) || import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
  if (selectedNetwork === 'mainnet-beta') {
    selectedNetwork = 'devnet';
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedNetwork', 'devnet');
    }
  }
  const getRpcUrl = (network: string) => {
    switch (network) {
      case 'mainnet-beta':
        return 'https://api.mainnet-beta.solana.com';
      case 'testnet':
        return 'https://api.testnet.solana.com';
      default:
        return 'https://api.devnet.solana.com';
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