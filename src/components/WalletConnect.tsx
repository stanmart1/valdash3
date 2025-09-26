import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useBalance } from '../hooks/useBalance';

export const WalletConnect = () => {
  const { connected, publicKey } = useWallet();
  const { balance, loading } = useBalance();

  return (
    <div className="flex gap-2 w-full">
      {/* Balance Display */}
      <div className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1">
        {connected && publicKey ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <div className="text-sm text-center">
              <div className="font-medium text-green-700 dark:text-green-300">
                {loading ? 'Loading...' : `${balance?.toFixed(2) || '0.00'} SOL`}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-mono">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">Not Connected</div>
        )}
      </div>
      
      {/* Wallet Button */}
      <div className="flex-1">
        {!connected ? (
          <button className="bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm px-3 py-2 w-full justify-center flex items-center space-x-1 text-white font-medium">
            Select Wallet
          </button>
        ) : (
          <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 !rounded-lg !transition-colors !text-sm !px-3 !py-2 !w-full !justify-center !flex !items-center !space-x-1" />
        )}
      </div>
    </div>
  );
};