import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import ValidatorDashboard from './components/ValidatorDashboard'
import '@solana/wallet-adapter-react-ui/styles.css'
import './App.css'

function App() {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app">
            <header>
              <h1>🛠️ Solana Validator Dashboard</h1>
            </header>
            <ValidatorDashboard />
            <footer style={{ textAlign: 'center', padding: '2rem' }}>
              <a 
                href="https://explorer.solana.com/address/9KxB22cPSBkKXJJ9wusjQkfeVUrbT5qzCWdhCpnW5dpC?cluster=devnet"
                target="_blank"
                rel="noopener noreferrer"
                className="blockchain-verify"
              >
                🔗 Verify on Blockchain
              </a>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App