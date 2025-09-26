import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiConfig {
  provider: 'helius' | 'jito' | 'solanafm' | 'shyft';
  apiKey: string;
  network: 'mainnet' | 'devnet' | 'testnet';
}

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ApiConfig) => void;
  currentConfig: ApiConfig;
}

export const ApiConfigModal = ({ isOpen, onClose, onSave, currentConfig }: ApiConfigModalProps) => {
  const [config, setConfig] = useState<ApiConfig>(currentConfig);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const providers = [
    { 
      id: 'helius', 
      name: 'Helius', 
      icon: '🌟', 
      description: 'Deepest data: stake, accounts, enriched tx, indexing'
    },
    { 
      id: 'jito', 
      name: 'Jito Labs API', 
      icon: '⚡', 
      description: 'MEV metrics, bundle insights, searcher data'
    },
    { 
      id: 'solanafm', 
      name: 'SolanaFM', 
      icon: '📊', 
      description: 'Detailed validator analytics + historical data'
    },
    { 
      id: 'shyft', 
      name: 'Shyft API', 
      icon: '🏷️', 
      description: 'Metadata enrichment and labeling'
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                🔑 API Configuration
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Network
                </label>
                <select
                  value={config.network}
                  onChange={(e) => setConfig({ ...config, network: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="mainnet">Mainnet Beta</option>
                  <option value="devnet">Devnet</option>
                  <option value="testnet">Testnet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Provider
                </label>
                <select
                  value={config.provider}
                  onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.icon} {provider.name}
                    </option>
                  ))}
                </select>
                
                {providers.find(p => p.id === config.provider) && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {providers.find(p => p.id === config.provider)?.description}
                    </p>
                  </div>
                )}
                
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder={`Enter ${providers.find(p => p.id === config.provider)?.name} API key`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 Premium API keys enable enhanced data accuracy, higher rate limits, and additional features like historical data and advanced analytics.
              </p>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};