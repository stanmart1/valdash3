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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">🏛️ Validator Overview</h2>
          <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full whitespace-nowrap">
            ✨ Premium
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            Updated: {new Date().toLocaleTimeString()}
          </span>
          <button 
            onClick={refetch}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center space-x-1"
          >
            <span className={isLoading ? 'animate-spin' : ''}>{isLoading ? '⏳' : '🔄'}</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-100 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {validatorInfo?.voteAccount ? '✅' : '⚠️'}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Status</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {validatorInfo?.voteAccount ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white break-all">{currentSlot?.toLocaleString()}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Current Slot</div>
          {validatorInfo?.lastVote && (
            <div className="text-xs text-blue-700 dark:text-blue-300 break-all">
              Last Vote: {validatorInfo.lastVote.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{epochInfo?.epoch}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Epoch</div>
          {validatorInfo?.commission !== undefined && (
            <div className="text-xs text-purple-700 dark:text-purple-300">
              {validatorInfo.commission}% Commission
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg border border-orange-100 dark:border-orange-800">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{version?.['solana-core']}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">Version</div>
          {validatorInfo?.credits && (
            <div className="text-xs text-orange-700 dark:text-orange-300 truncate">
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
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">{performance.blockProductionRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Block Production</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{performance.voteSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Vote Success</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{performance.skipRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Skip Rate</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="text-lg font-bold text-purple-700 dark:text-purple-400">{performance.uptime.toFixed(1)}%</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Uptime</div>
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
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded break-all">
            {validatorKey}
          </div>
        )}
      </div>
    </div>
  );
};