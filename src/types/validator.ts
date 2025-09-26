export interface ValidatorMetrics {
  publicKey: string;
  voteAccount: string;
  identity: string;
  commission: number;
  lastVote: number;
  rootSlot: number;
  credits: number;
  epochCredits: Array<[number, number, number]>;
  activatedStake: number;
  version: string;
  status: 'active' | 'delinquent' | 'inactive';
}

export interface PerformanceMetrics {
  blockProductionRate: number;
  voteSuccessRate: number;
  skipRate: number;
  uptime: number;
  averageSlotTime: number;
  lastUpdated: Date;
}

export interface StakeMetrics {
  totalStake: number;
  activatedStake: number;
  deactivatingStake: number;
  commission: number;
  apr: number;
  epochRewards: number;
  totalRewards: number;
}

export interface MEVMetrics {
  mevCaptured: number;
  bundleSuccessRate: number;
  additionalAPR: number;
  totalBundles: number;
  successfulBundles: number;
  averageMEVPerBundle: number;
  lastUpdated: Date;
}

export interface NetworkMetrics {
  totalValidators: number;
  totalStake: number;
  averageSkipRate: number;
  tps: number;
  health: 'ok' | 'behind' | 'unknown';
  lastUpdated: Date;
}

export interface ValidatorSearchResult {
  name: string;
  key: string;
  stake: number;
  commission: number;
  apr: number;
}