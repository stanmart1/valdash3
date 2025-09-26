import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { stakeService } from '../services/stakeService';
import { useBalance } from '../hooks/useBalance';

interface StakeOperationsProps {
  validatorKey?: string;
}

export const StakeOperations = ({ validatorKey }: StakeOperationsProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { balance } = useBalance();
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleStake = async () => {
    if (!publicKey || !validatorKey || !stakeAmount) return;

    setLoading(true);
    try {
      const stakeAccountKeypair = Keypair.generate();
      const lamports = parseFloat(stakeAmount) * LAMPORTS_PER_SOL;
      const validatorPublicKey = new PublicKey(validatorKey);

      const transaction = await stakeService.createStakeAccount(
        publicKey,
        stakeAccountKeypair.publicKey,
        validatorPublicKey,
        lamports
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [stakeAccountKeypair]
      });

      setTxSignature(signature);
      setStakeAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          💰 Staking Operations
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔗</div>
          <p className="text-gray-600 dark:text-gray-400">Connect your wallet to stake SOL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        💰 Staking Operations
      </h2>

      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Available Balance: <span className="font-semibold">{balance?.toFixed(4) || '0.0000'} SOL</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stake Amount (SOL)
          </label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount to stake"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            step="0.01"
            min="0.01"
          />
        </div>

        {validatorKey && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Staking to validator: <span className="font-mono text-xs">{validatorKey.slice(0, 8)}...{validatorKey.slice(-8)}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleStake}
          disabled={loading || !stakeAmount || !validatorKey || parseFloat(stakeAmount) > (balance || 0)}
          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          {loading ? 'Staking...' : 'Stake SOL'}
        </button>

        {txSignature && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ Stake transaction submitted!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-mono mt-1">
              {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
            </p>
          </div>
        )}

        {!validatorKey && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              💡 Enter a validator key to enable staking
            </p>
          </div>
        )}
      </div>
    </div>
  );
};