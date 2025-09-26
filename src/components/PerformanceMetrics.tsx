import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { validatorService, ValidatorPerformance } from '../services/validatorService';
import { useValidatorData } from '../hooks/useValidatorData';
import { formatPercentage, getPerformanceBadge } from '../utils/formatters';
import { PERFORMANCE_THRESHOLDS } from '../constants';

interface PerformanceMetricsProps {
  validatorKey?: string;
}

export const PerformanceMetrics = ({ validatorKey }: PerformanceMetricsProps) => {
  const { validatorInfo, epochInfo, isLoading: dataLoading } = useValidatorData(validatorKey);
  const [performance, setPerformance] = useState<ValidatorPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!validatorKey) {
        setPerformance({
          blockProductionRate: 96.8,
          voteSuccessRate: 98.2,
          skipRate: 2.1,
          uptime: 99.1,
          averageSlotTime: 400,
        });
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const perf = await validatorService.getValidatorPerformance(validatorKey);
        setPerformance(perf);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
        console.error('Failed to fetch performance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
    const interval = setInterval(fetchPerformance, 30000);
    return () => clearInterval(interval);
  }, [validatorKey]);

  if (dataLoading || loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!performance) return null;

  const missedBlocks = validatorInfo?.epochCredits ? 
    Math.max(0, Math.floor((100 - performance.blockProductionRate) / 100 * 1000)) : 12;
  const totalBlocks = validatorInfo?.epochCredits ? 
    validatorInfo.epochCredits.reduce((sum, [, credits]) => sum + credits, 0) : 1247;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          📊 Performance Metrics
        </h2>
        {validatorKey && (
          <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Real-time</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-green-600">
              {formatPercentage(performance.blockProductionRate)}
            </span>
            <span className="text-lg">
              {getPerformanceBadge(performance.blockProductionRate, { excellent: PERFORMANCE_THRESHOLDS.EXCELLENT_VOTE_SUCCESS, good: PERFORMANCE_THRESHOLDS.GOOD_VOTE_SUCCESS })}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Block Production</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            {epochInfo ? `Epoch ${epochInfo.epoch}` : 'Current epoch'}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-blue-600">
              {formatPercentage(performance.voteSuccessRate)}
            </span>
            <span className="text-lg">
              {getPerformanceBadge(performance.voteSuccessRate, { excellent: PERFORMANCE_THRESHOLDS.EXCELLENT_VOTE_SUCCESS, good: PERFORMANCE_THRESHOLDS.GOOD_VOTE_SUCCESS })}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Vote Success</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {validatorInfo?.lastVote ? `Last: ${validatorInfo.lastVote.toLocaleString()}` : 'Voting active'}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-yellow-600">
              {formatPercentage(performance.skipRate)}
            </span>
            <span className="text-lg">
              {getPerformanceBadge(performance.skipRate, { excellent: PERFORMANCE_THRESHOLDS.LOW_SKIP_RATE, good: PERFORMANCE_THRESHOLDS.HIGH_SKIP_RATE }, true)}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Skip Rate</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            {missedBlocks} missed blocks
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-purple-600">
              {formatPercentage(performance.uptime)}
            </span>
            <span className="text-lg">
              {getPerformanceBadge(performance.uptime, { excellent: PERFORMANCE_THRESHOLDS.EXCELLENT_UPTIME, good: PERFORMANCE_THRESHOLDS.GOOD_UPTIME })}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            ~{performance.averageSlotTime}ms avg slot
          </div>
        </motion.div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 rounded-lg border border-gray-100 dark:border-gray-600">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Missed Blocks</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Current epoch performance
            </div>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">{missedBlocks.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 rounded-lg border border-gray-100 dark:border-gray-600">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Total Credits</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Accumulated epoch credits
            </div>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">{totalBlocks.toLocaleString()}</span>
        </div>
      </div>
      
      {!validatorKey && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            💡 Enter a validator key to see real performance metrics
          </p>
        </div>
      )}
    </motion.div>
  );
};