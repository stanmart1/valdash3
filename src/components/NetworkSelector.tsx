import { useState } from 'react';

type Network = 'devnet' | 'testnet' | 'mainnet-beta';

interface NetworkSelectorProps {
  currentNetwork: Network;
  onNetworkChange: (network: Network) => void;
}

export const NetworkSelector = ({ currentNetwork, onNetworkChange }: NetworkSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const networks: { value: Network; label: string; color: string }[] = [
    { value: 'devnet', label: 'Devnet', color: 'bg-green-500' },
    { value: 'testnet', label: 'Testnet', color: 'bg-yellow-500' },
    { value: 'mainnet-beta', label: 'Mainnet', color: 'bg-red-500' },
  ];

  const currentNetworkData = networks.find(n => n.value === currentNetwork);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className={`w-3 h-3 rounded-full ${currentNetworkData?.color}`}></div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {currentNetworkData?.label}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {networks.map((network) => (
            <button
              key={network.value}
              onClick={() => {
                onNetworkChange(network.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentNetwork === network.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${network.color}`}></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {network.label}
              </span>
              {currentNetwork === network.value && (
                <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};