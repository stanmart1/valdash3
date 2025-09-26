export const formatSOL = (amount: number, decimals: number = 2): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(decimals)}M SOL`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(decimals)}K SOL`;
  }
  return `${amount.toFixed(decimals)} SOL`;
};

export const formatUSD = (amount: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPublicKey = (key: string, startChars: number = 8, endChars: number = 8): string => {
  if (key.length <= startChars + endChars) return key;
  return `${key.slice(0, startChars)}...${key.slice(-endChars)}`;
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export const getPerformanceColor = (value: number, thresholds: { excellent: number; good: number }, reverse: boolean = false): string => {
  if (reverse) {
    if (value <= thresholds.excellent) return 'text-green-600';
    if (value <= thresholds.good) return 'text-yellow-600';
    return 'text-red-600';
  } else {
    if (value >= thresholds.excellent) return 'text-green-600';
    if (value >= thresholds.good) return 'text-yellow-600';
    return 'text-red-600';
  }
};

export const getPerformanceBadge = (value: number, thresholds: { excellent: number; good: number }, reverse: boolean = false): string => {
  if (reverse) {
    if (value <= thresholds.excellent) return '🟢';
    if (value <= thresholds.good) return '🟡';
    return '🔴';
  } else {
    if (value >= thresholds.excellent) return '🟢';
    if (value >= thresholds.good) return '🟡';
    return '🔴';
  }
};