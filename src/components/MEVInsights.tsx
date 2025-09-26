import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MEVInsightsProps {
  validatorKey?: string;
}

interface MEVData {
  mevCaptured: number;
  bundleSuccessRate: number;
  additionalAPR: number;
  totalBundles: number;
  successfulBundles: number;
  averageMEVPerBundle: number;
  lastUpdated: Date;
}

export const MEVInsights = ({ validatorKey }: MEVInsightsProps) => {
  const [mevData, setMevData] = useState<MEVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMEVData = async () => {
      setLoading(true);
      
      try {
        const { jitoClient } = await import('../utils/jitoClient');
        const jitoData = await jitoClient.getMEVData(validatorKey);
        
        const mevData: MEVData = {
          mevCaptured: jitoData.mevCaptured,
          bundleSuccessRate: jitoData.bundleSuccessRate,
          additionalAPR: jitoData.additionalAPR,
          totalBundles: jitoData.totalBundles,
          successfulBundles: jitoData.successfulBundles,
          averageMEVPerBundle: jitoData.mevCaptured / jitoData.successfulBundles,
          lastUpdated: new Date(),
        };
        
        setMevData(mevData);
      } catch (error) {
        console.error('Failed to fetch MEV data:', error);
        setMevData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMEVData();
    const interval = setInterval(fetchMEVData, 45000);
    return () => clearInterval(interval);
  }, [validatorKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!mevData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">🚀 MEV Analytics</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔑</div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">MEV data requires API configuration</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Configure Jito Labs API key to view MEV metrics</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          🚀 MEV Analytics
        </h2>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span>Jito Integration</span>
        </div>
      </div>
      
      <div className="mb-6 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <p className="text-xs text-orange-700 dark:text-orange-300">
          <span className="font-medium">🚀 MEV Explained:</span> 
          Maximum Extractable Value (MEV) represents additional profits from transaction ordering and bundling. 
          Higher bundle success rates (&gt;80%) and consistent MEV capture indicate effective participation in the MEV ecosystem.
          {validatorKey ? ' Your validator\'s MEV performance is shown with Jito block engine data.' : ' Network averages displayed - connect your validator for personalized MEV insights.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800"
        >
          <div className="text-3xl font-bold text-green-600">{mevData.mevCaptured.toFixed(1)} SOL</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">MEV Captured</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            ~${(mevData.mevCaptured * 23.5).toFixed(0)} USD
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          <div className="text-3xl font-bold text-blue-600">{mevData.bundleSuccessRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Bundle Success Rate</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {mevData.successfulBundles}/{mevData.totalBundles} bundles
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
        >
          <div className="text-3xl font-bold text-purple-600">+{mevData.additionalAPR.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Additional APR</div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            From MEV rewards
          </div>
        </motion.div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Average MEV per Bundle</span>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              Based on successful bundles
            </div>
          </div>
          <span className="font-bold text-xl text-orange-600">{mevData.averageMEVPerBundle.toFixed(3)} SOL</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Bundles</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{mevData.totalBundles.toLocaleString()}</div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{mevData.bundleSuccessRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      {!validatorKey && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            💡 Enter a validator key to see personalized MEV performance data
          </p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Last updated: {mevData.lastUpdated.toLocaleTimeString()} • Data from Jito Block Engine
      </div>
    </motion.div>
  );
};