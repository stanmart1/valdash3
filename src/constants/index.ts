export const SOLANA_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  TESTNET: 'https://api.testnet.solana.com',
} as const;

export const REFRESH_INTERVALS = {
  VALIDATOR_DATA: 30000, // 30 seconds
  MEV_DATA: 45000, // 45 seconds
  NETWORK_HEALTH: 60000, // 1 minute
  EPOCH_PROGRESS: 10000, // 10 seconds
} as const;

export const PERFORMANCE_THRESHOLDS = {
  EXCELLENT_UPTIME: 99.5,
  GOOD_UPTIME: 98.0,
  EXCELLENT_VOTE_SUCCESS: 99.0,
  GOOD_VOTE_SUCCESS: 95.0,
  LOW_SKIP_RATE: 2.0,
  HIGH_SKIP_RATE: 5.0,
} as const;

export const MEV_CONSTANTS = {
  AVERAGE_SOL_PRICE: 23.5, // USD
  MIN_MEV_THRESHOLD: 0.001, // SOL
  BUNDLE_TIMEOUT: 150, // milliseconds
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATION: 0.3,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const;

export const VALIDATOR_CATEGORIES = {
  FOUNDATION: 'Solana Foundation',
  EXCHANGE: 'Exchange',
  STAKING_PROVIDER: 'Staking Provider',
  INDEPENDENT: 'Independent',
  RPC_PROVIDER: 'RPC Provider',
} as const;