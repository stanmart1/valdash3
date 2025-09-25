interface AlertSettingsProps {
  threshold: number
  onThresholdChange: (threshold: number) => void
  currentUptime: number
}

export default function AlertSettings({ threshold, onThresholdChange, currentUptime }: AlertSettingsProps) {
  const isAlertActive = currentUptime < threshold

  return (
    <div className="alert-settings fade-in">
      <h3>🔔 Alert Settings</h3>
      <div className="threshold-control">
        <label>
          Uptime Alert Threshold: {threshold}%
          <input
            type="range"
            min="80"
            max="100"
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            className="threshold-slider"
          />
        </label>
      </div>
      
      {isAlertActive && (
        <div className="alert-message">
          🚨 Alert: Validator uptime ({currentUptime.toFixed(2)}%) is below threshold ({threshold}%)
        </div>
      )}
      
      <div className={`alert-status ${isAlertActive ? 'glass-effect' : ''}`}>
        <span className={`status-indicator ${isAlertActive ? 'offline' : 'online'}`}></span>
        Status: {isAlertActive ? '🔴 Alert Active' : '🟢 Normal Operation'}
      </div>
    </div>
  )
}