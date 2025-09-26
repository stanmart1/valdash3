import { Connection, PublicKey } from '@solana/web3.js';
import { connection } from '../utils/solanaClient';

export interface ValidatorPerformance {
  blockProductionRate: number;
  voteSuccessRate: number;
  skipRate: number;
  uptime: number;
  averageSlotTime: number;
}

export interface StakeInfo {
  totalStake: number;
  activatedStake: number;
  deactivatingStake: number;
  commission: number;
  apr: number;
}

export interface RewardsInfo {
  epochRewards: number;
  totalRewards: number;
  rewardsHistory: Array<{
    epoch: number;
    rewards: number;
    commission: number;
  }>;
}

export class ValidatorService {
  private connection: Connection;

  constructor() {
    this.connection = connection;
  }

  async validatePublicKey(keyString: string): Promise<boolean> {
    try {
      new PublicKey(keyString);
      return true;
    } catch {
      return false;
    }
  }

  async getValidatorExists(validatorKey: string): Promise<boolean> {
    try {
      new PublicKey(validatorKey);
      const voteAccounts = await this.connection.getVoteAccounts();
      
      return voteAccounts.current.some(account => 
        account.nodePubkey === validatorKey || account.votePubkey === validatorKey
      ) || voteAccounts.delinquent.some(account => 
        account.nodePubkey === validatorKey || account.votePubkey === validatorKey
      );
    } catch {
      return false;
    }
  }

  async getValidatorPerformance(validatorKey: string): Promise<ValidatorPerformance> {
    try {
      new PublicKey(validatorKey);
      const voteAccounts = await this.connection.getVoteAccounts();
      
      const validator = voteAccounts.current.find(account => 
        account.nodePubkey === validatorKey || account.votePubkey === validatorKey
      );

      if (!validator) {
        return {
          blockProductionRate: 0,
          voteSuccessRate: 0,
          skipRate: 100,
          uptime: 0,
          averageSlotTime: 400,
        };
      }

      // Get real performance data from Solana RPC
      const epochInfo = await this.connection.getEpochInfo();
      const blockProduction = await this.connection.getBlockProduction();
      
      const validatorStats = blockProduction.value.byIdentity[validatorKey];
      const blockProductionRate = validatorStats ? 
        (validatorStats[1] / (validatorStats[0] + validatorStats[1])) * 100 : 0;
      
      const recentCredits = validator.epochCredits.slice(-3);
      const totalCredits = recentCredits.reduce((sum, [, credits]) => sum + credits, 0);
      const expectedCredits = recentCredits.length * epochInfo.slotsInEpoch;
      const voteSuccessRate = expectedCredits > 0 ? (totalCredits / expectedCredits) * 100 : 0;
      
      return {
        blockProductionRate: Math.min(100, Math.max(0, blockProductionRate)),
        voteSuccessRate: Math.min(100, Math.max(0, voteSuccessRate)),
        skipRate: Math.max(0, 100 - blockProductionRate),
        uptime: Math.min(100, Math.max(0, voteSuccessRate)),
        averageSlotTime: 400,
      };
    } catch (error) {
      throw new Error(`Failed to get validator performance: ${error}`);
    }
  }

  async getStakeInfo(validatorKey: string): Promise<StakeInfo> {
    try {
      const pubkey = new PublicKey(validatorKey);
      const [voteAccounts, stakeActivation] = await Promise.all([
        this.connection.getVoteAccounts(),
        this.connection.getStakeActivation(pubkey).catch(() => null),
      ]);

      const validator = voteAccounts.current.find(account => 
        account.nodePubkey === validatorKey || account.votePubkey === validatorKey
      );

      if (!validator) {
        throw new Error('Validator not found');
      }

      const totalStake = validator.activatedStake / 1e9;
      const commission = validator.commission;
      const baseAPR = 7.2;
      const commissionAdjustedAPR = baseAPR * (1 - commission / 100);

      return {
        totalStake,
        activatedStake: stakeActivation?.active ? stakeActivation.active / 1e9 : totalStake,
        deactivatingStake: (stakeActivation as any)?.deactivating ? (stakeActivation as any).deactivating / 1e9 : 0,
        commission,
        apr: commissionAdjustedAPR,
      };
    } catch (error) {
      throw new Error(`Failed to get stake info: ${error}`);
    }
  }

  async getRewardsInfo(validatorKey: string): Promise<RewardsInfo> {
    try {
      const stakeInfo = await this.getStakeInfo(validatorKey);
      const epochRewards = (stakeInfo.totalStake * stakeInfo.apr / 100) / 365 * 2.5;
      const totalRewards = epochRewards * 50;

      // Real rewards history would require historical RPC calls or external API
      const rewardsHistory: Array<{epoch: number, rewards: number, commission: number}> = [];

      return {
        epochRewards,
        totalRewards,
        rewardsHistory,
      };
    } catch (error) {
      throw new Error(`Failed to get rewards info: ${error}`);
    }
  }

  async searchValidators(query: string): Promise<Array<{name: string, key: string, stake: number}>> {
    const knownValidators = [
      { name: 'Solana Foundation', key: 'Certusm1sa411sMpV9FPqU5dXAYhmmhygvxJ23S6hJ24', stake: 500000 },
      { name: 'Coinbase', key: 'GdnSyH3YtwcxFvQrVVJMm1JhTS4QVX7MFsX56uJLUfiZ', stake: 750000 },
      { name: 'Binance', key: 'CakcnaRDHka2gXyfbEd2d3xsvkJkqsLw2akB3zsN1D2S', stake: 1200000 },
      { name: 'Figment', key: 'Figment1111111111111111111111111111111111111', stake: 300000 },
      { name: 'Staked', key: 'Staked111111111111111111111111111111111111111', stake: 450000 },
    ];

    return knownValidators.filter(validator => 
      validator.name.toLowerCase().includes(query.toLowerCase()) ||
      validator.key.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const validatorService = new ValidatorService();