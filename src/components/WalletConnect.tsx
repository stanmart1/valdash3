import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useBalance } from '../hooks/useBalance';

export const WalletConnect = () => {
  const { connected, publicKey } = useWallet();
  const { balance, loading } = useBalance();

  return (
    <div className="flex items-center space-x-3">
      {connected && publicKey && (
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="text-sm">
            <div className="font-medium text-green-700 dark:text-green-300">
              {loading ? 'Loading...' : `${balance?.toFixed(2) || '0.00'} SOL`}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 font-mono">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </div>
          </div>
        </div>
      )}
      <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 !rounded-lg !text-sm !px-4 !py-2" />
    </div>
  );
};