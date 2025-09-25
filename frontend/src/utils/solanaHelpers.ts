import { Connection } from '@solana/web3.js'

export interface ValidatorInfo {
  nodePubkey: string
  votePubkey: string
  activatedStake: number
  commission: number
  epochCredits: Array<[number, number, number]>
  lastVote: number
  rootSlot?: number
}

export async function fetchValidatorInfo(
  connection: Connection,
  validatorPubkey: string
): Promise<ValidatorInfo | null> {
  try {
    const voteAccounts = await connection.getVoteAccounts()
    
    let validator = voteAccounts.current.find(
      v => v.nodePubkey === validatorPubkey || v.votePubkey === validatorPubkey
    )
    
    if (!validator) {
      validator = voteAccounts.delinquent.find(
        v => v.nodePubkey === validatorPubkey || v.votePubkey === validatorPubkey
      )
    }
    
    return validator as ValidatorInfo | null
  } catch (error) {
    console.error('Error fetching validator info:', error)
    return null
  }
}

export function calculateValidatorMetrics(validator: ValidatorInfo) {
  const totalEpochs = 432
  const uptime = (validator.epochCredits.length / totalEpochs) * 100
  
  const totalRewards = validator.epochCredits.reduce(
    (sum, [, credits]) => sum + credits,
    0
  )
  
  const apr = validator.activatedStake > 0 
    ? (totalRewards / validator.activatedStake) * 365 * 100
    : 0
  
  return {
    uptime: Math.min(100, uptime),
    stakeAmount: validator.activatedStake,
    commission: validator.commission,
    rewards: totalRewards,
    apr: Math.max(0, apr),
    isActive: validator.epochCredits.length > 0
  }
}

export function formatSOL(lamports: number): string {
  return (lamports / 1e9).toFixed(2)
}