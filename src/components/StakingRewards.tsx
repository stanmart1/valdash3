import { motion } from 'framer-motion';

interface StakingRewardsProps {
  validatorKey?: string;
}

export const StakingRewards = ({ }: StakingRewardsProps) => {
  const rewardsData = {
    currentEpoch: 500,
    epochRewards: 2.5,
    totalRewards: 1250,
    rewardsHistory: [
      { epoch: 496, rewards: 2.3 },
      { epoch: 497, rewards: 2.4 },
      { epoch: 498, rewards: 2.6 },
      { epoch: 499, rewards: 2.2 },
      { epoch: 500, rewards: 2.5 },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Rewards History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">Epoch {rewardsData.currentEpoch}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Epoch</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{rewardsData.epochRewards} SOL</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">This Epoch</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{rewardsData.totalRewards} SOL</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Earned</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Epochs</h3>
        {rewardsData.rewardsHistory.map((epoch, index) => (
          <motion.div
            key={epoch.epoch}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className="text-gray-700 dark:text-gray-300">Epoch {epoch.epoch}</span>
            <span className="font-semibold text-green-600">{epoch.rewards} SOL</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};