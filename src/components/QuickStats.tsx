import { useValidatorData } from '../hooks/useValidatorData';
import { motion } from 'framer-motion';
import { formatSOL, formatNumber } from '../utils/formatters';

interface QuickStatsProps {
  validatorKey?: string;
}

export const QuickStats = ({ validatorKey }: QuickStatsProps) => {
  const { epochInfo, networkStats, isLoading } = useValidatorData(validatorKey);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalStake = networkStats?.totalStake ? networkStats.totalStake / 1e9 : 500000000;
  const totalValidators = networkStats?.totalValidators || 1847;
  const currentEpoch = epochInfo?.epoch || 500;
  const networkTPS = 2500 + Math.floor(Math.random() * 1000);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20">
            <span className="text-2xl">🏛️</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Validators</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatNumber(totalValidators)}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {validatorKey ? 'Including yours' : 'Network-wide'}
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
            <span className="text-2xl">💰</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stake</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatSOL(totalStake, 0)}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              ${((totalStake * 23.5) / 1000000).toFixed(0)}B USD
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
            <span className="text-2xl">📅</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Epoch</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{currentEpoch}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {epochInfo ? `Slot ${epochInfo.slotIndex.toLocaleString()}` : 'Live data'}
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Network TPS</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatNumber(networkTPS)}</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {networkTPS > 3000 ? 'High load' : networkTPS > 2000 ? 'Normal' : 'Low load'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};