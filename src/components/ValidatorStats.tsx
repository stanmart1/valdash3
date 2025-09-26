import { useState, useEffect } from 'react';
import { validatorService, StakeInfo, RewardsInfo } from '../services/validatorService';

interface ValidatorStatsProps {
  validatorKey?: string;
}

export const ValidatorStats = ({ validatorKey }: ValidatorStatsProps) => {
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
  const [rewardsInfo, setRewardsInfo] = useState<RewardsInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!validatorKey) {
        // Show mock data when no validator key
        setStakeInfo({
          totalStake: 125000,
          activatedStake: 125000,
          deactivatingStake: 0,
          commission: 5,
          apr: 7.2,
        });
        setRewardsInfo({
          epochRewards: 2.5,
          totalRewards: 1250,
          rewardsHistory: [],
        });
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const [stake, rewards] = await Promise.all([
          validatorService.getStakeInfo(validatorKey),
          validatorService.getRewardsInfo(validatorKey),
        ]);
        
        setStakeInfo(stake);
        setRewardsInfo(rewards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Failed to fetch validator stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [validatorKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stakingData = stakeInfo && rewardsInfo ? {
    totalStake: stakeInfo.totalStake,
    commission: stakeInfo.commission,
    epochRewards: rewardsInfo.epochRewards,
    totalRewards: rewardsInfo.totalRewards,
    apr: stakeInfo.apr,
  } : {
    totalStake: 125000,
    commission: 5,
    epochRewards: 2.5,
    totalRewards: 1250,
    apr: 7.2,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">💰 Validator Statistics</h2>
        {validatorKey && (
          <div className="text-xs text-green-600 dark:text-green-400 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        )}
      </div>
      
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-xs text-green-700 dark:text-green-300">
          <span className="font-medium">💰 Staking Insights:</span> 
          APR is calculated after commission deduction. Lower commission rates (0-10%) attract more delegators. 
          Epoch rewards fluctuate based on network activity and your validator's performance.
          {validatorKey ? ' Data sourced from your validator\'s stake activation and vote account information.' : ' Sample staking data shown - enter your validator key for accurate financial metrics.'}
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Total Stake</span>
            {stakeInfo && stakeInfo.activatedStake !== stakeInfo.totalStake && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {stakeInfo.activatedStake.toLocaleString()} SOL activated
              </div>
            )}
          </div>
          <span className="font-bold text-xl text-blue-600">{stakingData.totalStake.toLocaleString()} SOL</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <span className="text-gray-600 dark:text-gray-400">Commission Rate</span>
          <span className="font-bold text-xl text-purple-600">{stakingData.commission}%</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <span className="text-gray-600 dark:text-gray-400">Epoch Rewards</span>
          <span className="font-bold text-xl text-green-600">{stakingData.epochRewards.toFixed(2)} SOL</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Total Rewards</span>
            {rewardsInfo && rewardsInfo.rewardsHistory.length > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400">
                Last {rewardsInfo.rewardsHistory.length} epochs
              </div>
            )}
          </div>
          <span className="font-bold text-xl text-green-600">{stakingData.totalRewards.toLocaleString()} SOL</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Annual Percentage Rate</span>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              After {stakingData.commission}% commission
            </div>
          </div>
          <span className="font-bold text-xl text-orange-600">{stakingData.apr.toFixed(1)}%</span>
        </div>
      </div>
      
      {!validatorKey && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            💡 Enter a validator key above to see real staking data
          </p>
        </div>
      )}
    </div>
  );
};