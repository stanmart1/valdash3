import { motion } from 'framer-motion';
import { useValidatorData } from '../hooks/useValidatorData';
import { useState, useEffect } from 'react';

interface EpochProgressProps {
  validatorKey?: string;
}

export const EpochProgress = ({ validatorKey }: EpochProgressProps) => {
  const { epochInfo, isLoading } = useValidatorData(validatorKey);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!epochInfo) return;

    const updateTimer = () => {
      const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex;
      const secondsRemaining = slotsRemaining * 0.4; // ~400ms per slot
      const hoursRemaining = Math.floor(secondsRemaining / 3600);
      const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);
      
      setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [epochInfo]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!epochInfo) return null;

  const progress = (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;
  const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          📅 Epoch Progress
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Epoch {epochInfo.epoch}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {progress.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {epochInfo.slotIndex.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Current Slot
            </div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {slotsRemaining.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Slots Remaining
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Time Remaining
            </span>
          </div>
          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            {timeRemaining}
          </span>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Total slots in epoch: {epochInfo.slotsInEpoch.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};