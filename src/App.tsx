import { useState, useEffect } from 'react';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';
import { ValidatorKeyInput } from './components/ValidatorKeyInput';
import { LastUpdated } from './components/LastUpdated';
import { ApiConfigModal } from './components/ApiConfigModal';
import { connection } from './utils/solanaClient';

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'staking', label: 'Staking & Rewards', icon: '💰' },
  { id: 'mev', label: 'MEV Analytics', icon: '🚀' },
  { id: 'network', label: 'Network Health', icon: '🌐' },
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [validatorKey, setValidatorKey] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    provider: 'helius' as 'helius' | 'jito' | 'solanafm' | 'shyft',
    apiKey: '',
    network: 'mainnet' as 'mainnet' | 'devnet' | 'testnet',
  });

  useEffect(() => {
    // Test connection on app load
    const testConnection = async () => {
      try {
        await connection.getEpochInfo();
        console.log('✅ Connected to Solana network');
        setLastUpdated(new Date());
      } catch (error) {
        console.warn('⚠️ Solana connection failed, using mock data:', error);
        setLastUpdated(new Date());
      }
    };
    
    testConnection();

    // Update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Validator Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              📡 Last Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowApiModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <span>🔑</span>
              <span>Premium APIs</span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow'
              }`}
            >
              {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        {/* Validator Key Input */}
        <ValidatorKeyInput 
          onValidatorSet={setValidatorKey}
          currentValidator={validatorKey}
        />

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="px-6 pt-6">
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>
        </div>

        {/* Tab Content */}
        <TabContent activeTab={activeTab} validatorKey={validatorKey} />
        
        {/* Last Updated Timestamp */}
        <LastUpdated />

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Validator Dashboard - Real-time Solana network monitoring with MEV insights</p>
          <p className="mt-1">Built with React, TypeScript, and Solana Web3.js</p>
        </div>
      </div>
      
      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={setApiConfig}
        currentConfig={apiConfig}
      />
    </div>
  );
}

export default App;