import { useState, useEffect } from 'react';
import { connection } from '../utils/solanaClient';
import { EpochInfo, VoteAccountInfo, PublicKey, StakeActivationData } from '@solana/web3.js';

interface ValidatorInfo {
  publicKey: string;
  voteAccount: VoteAccountInfo | null;
  stakeActivation: StakeActivationData | null;
  identity: string;
  commission: number;
  lastVote: number;
  rootSlot: number;
  credits: number;
  epochCredits: Array<[number, number, number]>;
}

interface ValidatorData {
  epochInfo: EpochInfo | null;
  currentSlot: number | null;
  version: any | null;
  validatorInfo: ValidatorInfo | null;
  networkStats: {
    totalValidators: number;
    totalStake: number;
    averageSkipRate: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export const useValidatorData = (validatorKey?: string) => {
  const [data, setData] = useState<ValidatorData>({
    epochInfo: null,
    currentSlot: null,
    version: null,
    validatorInfo: null,
    networkStats: null,
    isLoading: true,
    error: null,
  });

  const fetchValidatorSpecificData = async (pubkey: PublicKey) => {
    try {
      const [voteAccounts, stakeActivation] = await Promise.all([
        connection.getVoteAccounts(),
        connection.getStakeActivation(pubkey).catch(() => null),
      ]);

      const validatorVoteAccount = voteAccounts.current.find(
        account => account.nodePubkey === pubkey.toString()
      ) || voteAccounts.delinquent.find(
        account => account.nodePubkey === pubkey.toString()
      );

      if (!validatorVoteAccount) {
        throw new Error('Validator not found in vote accounts');
      }

      return {
        publicKey: pubkey.toString(),
        voteAccount: validatorVoteAccount,
        stakeActivation,
        identity: validatorVoteAccount.nodePubkey,
        commission: validatorVoteAccount.commission,
        lastVote: validatorVoteAccount.lastVote,
        rootSlot: (validatorVoteAccount as any).rootSlot || 0,
        credits: validatorVoteAccount.epochCredits.reduce((sum, [, credits]) => sum + credits, 0),
        epochCredits: validatorVoteAccount.epochCredits,
      };
    } catch (error) {
      throw new Error(`Failed to fetch validator data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [epochInfo, currentSlot, version, voteAccountsInfo] = await Promise.all([
        connection.getEpochInfo(),
        connection.getSlot(),
        connection.getVersion(),
        connection.getVoteAccounts(),
      ]);

      let validatorInfo: ValidatorInfo | null = null;
      
      if (validatorKey) {
        try {
          const pubkey = new PublicKey(validatorKey);
          validatorInfo = await fetchValidatorSpecificData(pubkey);
        } catch (error) {
          console.warn('Failed to fetch validator-specific data:', error);
        }
      }

      const totalStake = voteAccountsInfo.current.reduce((sum, account) => sum + account.activatedStake, 0);
      const networkStats = {
        totalValidators: voteAccountsInfo.current.length + voteAccountsInfo.delinquent.length,
        totalStake,
        averageSkipRate: 2.1, // Mock data - would need historical slot data
      };

      setData({
        epochInfo,
        currentSlot,
        version,
        validatorInfo,
        networkStats,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Network data fetch failed:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch network data',
      }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [validatorKey]);

  return { ...data, refetch: fetchData };
};