import { PublicKey } from '@solana/web3.js';

export const validatePublicKey = (key: string): { isValid: boolean; error?: string } => {
  if (!key || key.trim().length === 0) {
    return { isValid: false, error: 'Public key is required' };
  }

  const trimmedKey = key.trim();
  
  if (trimmedKey.length < 32 || trimmedKey.length > 44) {
    return { isValid: false, error: 'Invalid public key length' };
  }

  try {
    new PublicKey(trimmedKey);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid public key format' };
  }
};

export const validateStakeAmount = (amount: string): { isValid: boolean; error?: string } => {
  if (!amount || amount.trim().length === 0) {
    return { isValid: false, error: 'Stake amount is required' };
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid number format' };
  }

  if (numAmount < 0) {
    return { isValid: false, error: 'Stake amount cannot be negative' };
  }

  if (numAmount < 1) {
    return { isValid: false, error: 'Minimum stake amount is 1 SOL' };
  }

  return { isValid: true };
};

export const validateCommission = (commission: string): { isValid: boolean; error?: string } => {
  if (!commission || commission.trim().length === 0) {
    return { isValid: false, error: 'Commission rate is required' };
  }

  const numCommission = parseFloat(commission);
  
  if (isNaN(numCommission)) {
    return { isValid: false, error: 'Invalid number format' };
  }

  if (numCommission < 0 || numCommission > 100) {
    return { isValid: false, error: 'Commission must be between 0% and 100%' };
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[^\w\s-]/gi, '');
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};