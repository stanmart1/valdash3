import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import ValidatorStats from './ValidatorStats'
import RewardsChart from './RewardsChart'
import AlertSettings from './AlertSettings'
import LoadingSpinner from './LoadingSpinner'
import { fetchValidatorInfo, calculateValidatorMetrics } from '../utils/solanaHelpers'

interface ValidatorData {
  uptime: number
  stakeAmount: number
  commission: number
  rewards: number
  apr: number
}

export default function ValidatorDashboard() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [validatorData, setValidatorData] = useState<ValidatorData | null>(null)
  const [validatorPubkey, setValidatorPubkey] = useState('')
  const [loading, setLoading] = useState(false)
  const [alertThreshold, setAlertThreshold] = useState(95)
  const [error, setError] = useState<string | null>(null)



  const fetchValidatorData = async () => {
    if (!validatorPubkey || !publicKey) return
    
    setLoading(true)
    setError(null)
    try {
      // Fetch real validator data from Solana RPC
      const validator = await fetchValidatorInfo(connection, validatorPubkey)

      if (validator) {
        const data = calculateValidatorMetrics(validator)
        
        setValidatorData(data)
        
        // Store data locally
        localStorage.setItem('validatorData', JSON.stringify(data))
      } else {
        setError('Validator not found')
      }
    } catch (error) {
      console.error('Error fetching validator data:', error)
      setError('Failed to fetch validator data')
    } finally {
      setLoading(false)
    }
  }

  const handleThresholdChange = (newThreshold: number) => {
    setAlertThreshold(newThreshold)
    localStorage.setItem('alertThreshold', newThreshold.toString())
  }

  useEffect(() => {
    // Load saved data
    const savedThreshold = localStorage.getItem('alertThreshold')
    if (savedThreshold) {
      setAlertThreshold(Number(savedThreshold))
    }
  }, [])

  useEffect(() => {
    if (validatorPubkey) {
      fetchValidatorData()
      const interval = setInterval(fetchValidatorData, 60000)
      return () => clearInterval(interval)
    }
  }, [validatorPubkey, connection])

  return (
    <div className="dashboard">
      <div className="wallet-section">
        <WalletMultiButton />
      </div>

      <div className="validator-input">
        <input
          type="text"
          placeholder="Enter Validator Public Key"
          value={validatorPubkey}
          onChange={(e) => setValidatorPubkey(e.target.value)}
          className="pubkey-input"
        />
        <button onClick={fetchValidatorData} disabled={loading || !validatorPubkey}>
          {loading ? (
            <>
              <span className="loading"></span>
              Loading...
            </>
          ) : (
            'Fetch Data'
          )}
        </button>
      </div>
      
      {error && (
        <div className="error-state">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}
      


      {loading && <LoadingSpinner />}
      
      {!loading && !validatorData && validatorPubkey && (
        <div className="empty-state">
          <h3>🔍 No Data Found</h3>
          <p>Unable to find validator data for the provided public key.</p>
        </div>
      )}
      
      {!loading && !validatorPubkey && (
        <div className="empty-state">
          <h3>🚀 Get Started</h3>
          <p>Enter a validator public key above to view real-time performance metrics.</p>
        </div>
      )}

      {!loading && validatorData && (
        <>
          <ValidatorStats data={validatorData} threshold={alertThreshold} />
          <RewardsChart data={validatorData} />
          <AlertSettings 
            threshold={alertThreshold} 
            onThresholdChange={handleThresholdChange}
            currentUptime={validatorData.uptime}
          />
        </>
      )}
    </div>
  )
}