import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import idl from '../validator_dashboard.json'

const PROGRAM_ID = new PublicKey('9KxB22cPSBkKXJJ9wusjQkfeVUrbT5qzCWdhCpnW5dpC')

export function useValidatorProgram() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const provider = useMemo(() => {
    if (!wallet.publicKey) return null
    return new AnchorProvider(connection, wallet as any, {
      commitment: 'confirmed'
    })
  }, [connection, wallet])

  const program = useMemo(() => {
    if (!provider) return null
    return new Program(idl as any, PROGRAM_ID, provider)
  }, [provider])

  const initializeDashboard = async () => {
    if (!program || !wallet.publicKey) throw new Error('Program not initialized')
    
    const dashboardKeypair = web3.Keypair.generate()
    
    await program.methods
      .initialize()
      .accounts({
        dashboard: dashboardKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([dashboardKeypair])
      .rpc()
    
    return dashboardKeypair.publicKey
  }

  const updateValidatorStats = async (
    dashboardPubkey: PublicKey,
    uptime: number,
    stakeAmount: number,
    commission: number,
    rewards: number
  ) => {
    if (!program || !wallet.publicKey) throw new Error('Program not initialized')
    
    await program.methods
      .updateValidatorStats(
        new BN(Math.floor(uptime * 100)),
        new BN(stakeAmount),
        commission,
        new BN(rewards)
      )
      .accounts({
        dashboard: dashboardPubkey,
        authority: wallet.publicKey,
      })
      .rpc()
  }

  const getDashboardData = async (dashboardPubkey: PublicKey) => {
    if (!program) throw new Error('Program not initialized')
    
    const account = await program.account.validatorDashboard.fetch(dashboardPubkey) as any
    return {
      authority: account.authority,
      uptime: account.uptime.toNumber() / 100,
      stakeAmount: account.stakeAmount.toNumber(),
      commission: account.commission,
      rewards: account.rewards.toNumber(),
      alertThreshold: account.alertThreshold.toNumber(),
      lastUpdated: account.lastUpdated.toNumber()
    }
  }

  const setAlertThreshold = async (dashboardPubkey: PublicKey, threshold: number) => {
    if (!program || !wallet.publicKey) throw new Error('Program not initialized')
    
    await program.methods
      .setAlertThreshold(new BN(threshold))
      .accounts({
        dashboard: dashboardPubkey,
        authority: wallet.publicKey,
      })
      .rpc()
  }

  return {
    program,
    initializeDashboard,
    updateValidatorStats,
    getDashboardData,
    setAlertThreshold,
    isReady: !!program
  }
}