import { useTransactions } from '../hooks/useTransactions';
import { useWallet } from '@solana/wallet-adapter-react';

export const TransactionHistory = () => {
  const { publicKey } = useWallet();
  const { transactions, loading } = useTransactions();

  if (!publicKey) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📜 Transaction History
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔗</div>
          <p className="text-gray-600 dark:text-gray-400">Connect wallet to view transactions</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📜 Transaction History
        </h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        📜 Transaction History
      </h2>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.signature}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${tx.err ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'Pending'}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${tx.err ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.err ? 'Failed' : 'Success'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Slot {tx.slot?.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};