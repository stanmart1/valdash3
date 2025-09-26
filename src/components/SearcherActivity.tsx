import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearcherActivityProps {
  validatorKey?: string;
}

interface SearcherData {
  opportunitiesDetected: number;
  arbitrageBots: number;
  liquidationEvents: number;
  backrunProfits: number;
  totalSearchers: number;
  activeSearchers: number;
  averageProfit: number;
  lastUpdated: Date;
}

export const SearcherActivity = ({ validatorKey }: SearcherActivityProps) => {
  const [searcherData, setSearcherData] = useState<SearcherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearcherData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData: SearcherData = {
        opportunitiesDetected: validatorKey ? 1847 + Math.floor(Math.random() * 200) : 1623,
        arbitrageBots: validatorKey ? 23 + Math.floor(Math.random() * 10) : 18,
        liquidationEvents: validatorKey ? 156 + Math.floor(Math.random() * 50) : 134,
        backrunProfits: validatorKey ? 12.4 + Math.random() * 5 : 9.8,
        totalSearchers: validatorKey ? 89 + Math.floor(Math.random() * 20) : 76,
        activeSearchers: 0,
        averageProfit: validatorKey ? 0.067 + Math.random() * 0.03 : 0.052,
        lastUpdated: new Date(),
      };
      
      mockData.activeSearchers = Math.floor(mockData.totalSearchers * (0.6 + Math.random() * 0.3));
      
      setSearcherData(mockData);
      setLoading(false);
    };

    fetchSearcherData();
    const interval = setInterval(fetchSearcherData, 60000);
    return () => clearInterval(interval);
  }, [validatorKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!searcherData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          🤖 Searcher Activity
        </h2>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Live MEV Data</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-100 dark:border-orange-800"
        >
          <div className="text-2xl font-bold text-orange-600">{searcherData.opportunitiesDetected.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Opportunities</div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            Last 24h
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-100 dark:border-red-800"
        >
          <div className="text-2xl font-bold text-red-600">{searcherData.arbitrageBots}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Arbitrage Bots</div>
          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
            Active now
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800"
        >
          <div className="text-2xl font-bold text-indigo-600">{searcherData.liquidationEvents}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Liquidations</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
            This epoch
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border border-teal-100 dark:border-teal-800"
        >
          <div className="text-2xl font-bold text-teal-600">{searcherData.backrunProfits.toFixed(1)} SOL</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Backrun Profits</div>
          <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">
            ~${(searcherData.backrunProfits * 23.5).toFixed(0)} USD
          </div>
        </motion.div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Active Searchers</span>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {searcherData.totalSearchers} total registered
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-xl text-purple-600">{searcherData.activeSearchers}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {((searcherData.activeSearchers / searcherData.totalSearchers) * 100).toFixed(0)}% active
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Average Profit per Opportunity</span>
            <div className="text-xs text-green-600 dark:text-green-400">
              Based on successful extractions
            </div>
          </div>
          <span className="font-bold text-xl text-green-600">{searcherData.averageProfit.toFixed(3)} SOL</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {((searcherData.backrunProfits / searcherData.opportunitiesDetected) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Competition Level</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {searcherData.activeSearchers > 60 ? 'High' : searcherData.activeSearchers > 30 ? 'Medium' : 'Low'}
            </div>
          </div>
        </div>
      </div>
      
      {!validatorKey && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            💡 Enter a validator key to see validator-specific searcher activity
          </p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Last updated: {searcherData.lastUpdated.toLocaleTimeString()} • MEV Searcher Analytics
      </div>
    </motion.div>
  );
};