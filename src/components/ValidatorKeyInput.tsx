import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validatorService } from '../services/validatorService';

interface ValidatorKeyInputProps {
  onValidatorSet: (validatorKey: string) => void;
  currentValidator?: string;
}

interface SearchResult {
  name: string;
  key: string;
  stake: number;
}

export const ValidatorKeyInput = ({ onValidatorSet, currentValidator }: ValidatorKeyInputProps) => {
  const [inputKey, setInputKey] = useState(currentValidator || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchValidators = async () => {
      if (searchQuery.length > 2) {
        try {
          const results = await validatorService.searchValidators(searchQuery);
          setSearchResults(results);
          setShowDropdown(results.length > 0);
        } catch (error) {
          console.error('Search failed:', error);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(searchValidators, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const validateAndSetKey = async () => {
    if (!inputKey.trim()) {
      setError('Please enter a validator public key');
      return;
    }

    setIsValidating(true);
    setError('');
    setSuccess('');

    try {
      const isValidFormat = await validatorService.validatePublicKey(inputKey.trim());
      if (!isValidFormat) {
        setError('Invalid public key format');
        return;
      }

      const validatorExists = await validatorService.getValidatorExists(inputKey.trim());
      if (!validatorExists) {
        setError('Validator not found in network. Using provided key anyway.');
      } else {
        setSuccess('✅ Validator found and verified');
      }

      onValidatorSet(inputKey.trim());
      setShowDropdown(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputKey(value);
    setSearchQuery(value);
    setError('');
    setSuccess('');
  };

  const selectValidator = (validator: SearchResult) => {
    setInputKey(validator.key);
    setSearchQuery('');
    setShowDropdown(false);
    onValidatorSet(validator.key);
    setSuccess(`✅ Selected ${validator.name}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndSetKey();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          🔑 Validator Configuration
        </h2>
        {currentValidator && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search or Enter Validator Public Key
            </label>
            <div className="group relative">
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">
                ℹ️ Help
              </button>
              <div className="absolute right-0 top-6 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">How to use this dashboard:</h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Search by validator name or paste a public key</li>
                  <li>• Use sample validators to explore features</li>
                  <li>• View network data without entering a key</li>
                  <li>• Get real-time updates every 30 seconds</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputKey}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => searchQuery.length > 2 && setShowDropdown(true)}
                  placeholder="Search by name or enter public key..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              <button
                onClick={validateAndSetKey}
                disabled={isValidating || !inputKey.trim()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
            
            <AnimatePresence>
              {showDropdown && searchResults.length > 0 && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {searchResults.map((validator, index) => (
                    <motion.button
                      key={validator.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => selectValidator(validator)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{validator.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {validator.key.slice(0, 8)}...{validator.key.slice(-8)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {(validator.stake / 1000).toFixed(0)}K SOL
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-500 flex items-center space-x-1"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.p>
          )}
          
          {success && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-green-600 flex items-center space-x-1"
            >
              <span>✅</span>
              <span>{success}</span>
            </motion.p>
          )}
          
          {currentValidator && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Currently Monitoring
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 font-mono">
                    {currentValidator}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setInputKey('');
                    onValidatorSet('');
                    setSuccess('');
                    setError('');
                  }}
                  className="text-xs text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};