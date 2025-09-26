import { Connection, PublicKey, Transaction, StakeProgram, Authorized, Lockup, LAMPORTS_PER_SOL } from '@solana/web3.js';

export class StakeService {
  constructor(private connection: Connection) {}

  async createStakeAccount(
    payerPublicKey: PublicKey,
    stakeAccountKeypair: PublicKey,
    validatorPublicKey: PublicKey,
    lamports: number
  ) {
    const transaction = new Transaction();
    
    const createAccountInstruction = StakeProgram.createAccount({
      fromPubkey: payerPublicKey,
      stakePubkey: stakeAccountKeypair,
      authorized: new Authorized(payerPublicKey, payerPublicKey),
      lockup: new Lockup(0, 0, payerPublicKey),
      lamports,
    });

    const delegateInstruction = StakeProgram.delegate({
      stakePubkey: stakeAccountKeypair,
      authorizedPubkey: payerPublicKey,
      votePubkey: validatorPublicKey,
    });

    transaction.add(createAccountInstruction, delegateInstruction);
    return transaction;
  }

  async deactivateStake(stakeAccountPublicKey: PublicKey, authorizedPublicKey: PublicKey) {
    const transaction = new Transaction();
    
    const deactivateInstruction = StakeProgram.deactivate({
      stakePubkey: stakeAccountPublicKey,
      authorizedPubkey: authorizedPublicKey,
    });

    transaction.add(deactivateInstruction);
    return transaction;
  }

  async withdrawStake(
    stakeAccountPublicKey: PublicKey,
    authorizedPublicKey: PublicKey,
    toPubkey: PublicKey,
    lamports: number
  ) {
    const transaction = new Transaction();
    
    const withdrawInstruction = StakeProgram.withdraw({
      stakePubkey: stakeAccountPublicKey,
      authorizedPubkey: authorizedPublicKey,
      toPubkey,
      lamports,
    });

    transaction.add(withdrawInstruction);
    return transaction;
  }

  async getStakeAccounts(publicKey: PublicKey) {
    try {
      const accounts = await this.connection.getParsedProgramAccounts(StakeProgram.programId, {
        filters: [
          { dataSize: 200 },
          { memcmp: { offset: 12, bytes: publicKey.toBase58() } }
        ]
      });
      
      return accounts.map(account => ({
        pubkey: account.pubkey,
        account: account.account,
        lamports: account.account.lamports / LAMPORTS_PER_SOL,
      }));
    } catch (error) {
      console.error('Failed to fetch stake accounts:', error);
      return [];
    }
  }
}

export const stakeService = new StakeService(new Connection('https://api.devnet.solana.com'));