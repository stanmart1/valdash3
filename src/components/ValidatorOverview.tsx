import { useValidatorData } from '../hooks/useValidatorData';
import { validatorService } from '../services/validatorService';
import { useState, useEffect } from 'react';
import { ValidatorPerformance } from '../services/validatorService';

interface ValidatorOverviewProps {
  validatorKey?: string;
}

export const ValidatorOverview = ({ validatorKey }: ValidatorOverviewProps) => {
  const { epochInfo, currentSlot, version, validatorInfo, networkStats, isLoading, error, refetch } = useValidatorData(validatorKey);
  const [performance, setPerformance] = useState<ValidatorPerformance | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!validatorKey) return;
      
      setPerformanceLoading(true);
      try {
        const perf = await validatorService.getValidatorPerformance(validatorKey);
        setPerformance(perf);
      } catch (error) {
        console.error('Failed to fetch performance:', error);
      } finally {
        setPerformanceLoading(false);
      }
    };

    fetchPerformance();
  }, [validatorKey]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Validator Overview</h2>
        <div className="animate-pulse text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Validator Overview</h2>
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const epochProgress = epochInfo ? (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🏛️ Validator Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updated: {new Date().toLocaleTimeString()}
          </span>
          <button 
            onClick={refetch}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center space-x-1"
          >
            <span className={isLoading ? 'animate-spin' : ''}>{isLoading ? '⏳' : '🔄'}</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-500">
            {validatorInfo?.voteAccount ? '✅' : '⚠️'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {validatorInfo?.voteAccount ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentSlot?.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Slot</div>
          {validatorInfo?.lastVote && (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Last Vote: {validatorInfo.lastVote.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{epochInfo?.epoch}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Epoch</div>
          {validatorInfo?.commission !== undefined && (
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {validatorInfo.commission}% Commission
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{version?.['solana-core']}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Version</div>
          {validatorInfo?.credits && (
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {validatorInfo.credits.toLocaleString()} Credits
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Epoch Progress</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{epochProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${epochProgress}%` }}
          />
        </div>
        {epochInfo && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Slot {epochInfo.slotIndex.toLocaleString()} of {epochInfo.slotsInEpoch.toLocaleString()}
          </div>
        )}
      </div>

      {performance && !performanceLoading && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-green-600">{performance.blockProductionRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Block Production</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{performance.voteSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Vote Success</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">{performance.skipRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Skip Rate</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{performance.uptime.toFixed(1)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="text-lg text-gray-900 dark:text-white">
          Network: <span className="text-green-500 font-semibold">✅ Healthy</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {networkStats?.totalValidators || 0} validators, {((networkStats?.totalStake || 0) / 1e9).toFixed(0)}M SOL staked
        </div>
        {validatorKey && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {validatorKey}
          </div>
        )}
      </div>
    </div>
  );
};