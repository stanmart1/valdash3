import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const LastUpdated = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 py-4"
    >
      <span>📡</span>
      <span>Last Updated: {formatTime(lastUpdated)}</span>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    </motion.div>
  );
};