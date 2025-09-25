import { formatSOL } from '../utils/solanaHelpers'

interface ValidatorStatsProps {
  data: {
    uptime: number
    stakeAmount: number
    commission: number
    rewards: number
    apr: number
  }
  threshold: number
}

export default function ValidatorStats({ data, threshold }: ValidatorStatsProps) {
  const isLowUptime = data.uptime < threshold
  const isOnline = data.uptime > 90

  return (
    <div className="stats-grid fade-in">
      <div className={`stat-card ${isLowUptime ? 'alert' : ''}`}>
        <h3 className="tooltip" data-tooltip="Percentage of time validator has been active">
          <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></span>
          Uptime
        </h3>
        <div className="stat-value">
          {data.uptime.toFixed(2)}%
          {isLowUptime && <span className="alert-icon">🚨</span>}
        </div>
        <div className={`metric-trend ${data.uptime > 95 ? 'up' : 'down'}`}>
          {data.uptime > 95 ? '↗' : '↘'} {data.uptime > 95 ? 'Excellent' : 'Needs attention'}
        </div>
      </div>

      <div className="stat-card">
        <h3 className="tooltip" data-tooltip="Total SOL staked with this validator">💰 Stake Amount</h3>
        <div className="stat-value">{formatSOL(data.stakeAmount)} SOL</div>
        <div className="metric-trend">
          💎 ${(parseFloat(formatSOL(data.stakeAmount)) * 100).toFixed(0)} USD
        </div>
      </div>

      <div className="stat-card">
        <h3 className="tooltip" data-tooltip="Fee charged by validator for services">📊 Commission</h3>
        <div className="stat-value">{data.commission}%</div>
        <div className={`metric-trend ${data.commission < 5 ? 'up' : data.commission > 10 ? 'down' : ''}`}>
          {data.commission < 5 ? '✨ Competitive' : data.commission > 10 ? '⚠️ High' : '📈 Standard'}
        </div>
      </div>

      <div className="stat-card">
        <h3 className="tooltip" data-tooltip="Total rewards earned by delegators">🎁 Total Rewards</h3>
        <div className="stat-value">{data.rewards.toLocaleString()}</div>
        <div className="metric-trend up">
          ↗ +{(data.rewards * 0.1).toFixed(0)} this epoch
        </div>
      </div>

      <div className="stat-card">
        <h3 className="tooltip" data-tooltip="Annual Percentage Rate for staking rewards">📈 APR</h3>
        <div className="stat-value">{data.apr.toFixed(2)}%</div>
        <div className={`metric-trend ${data.apr > 7 ? 'up' : 'down'}`}>
          {data.apr > 7 ? '🚀 Above average' : '📉 Below average'}
        </div>
      </div>
    </div>
  )
}