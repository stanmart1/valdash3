# 🛠️ Solana Validator Dashboard

A full-stack Web3 application for monitoring Solana validator performance with real-time alerts and analytics.

## Features

- **Real-time Validator Stats**: Uptime, stake amount, commission, rewards
- **Performance Alerts**: Configurable thresholds with instant notifications
- **Rewards Analytics**: Historical APR and rewards visualization
- **Wallet Integration**: Connect with Phantom and other Solana wallets
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust + Tokio
- **Blockchain**: Solana + Anchor Framework
- **Charts**: Recharts
- **Deployment**: Docker + Coolify

## Quick Start

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Solana CLI
- Anchor CLI

### Installation

1. **Clone and setup**:
```bash
git clone <repo-url>
cd valdash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your validator public key and RPC URL
```

3. **Build Solana program**:
```bash
anchor build
anchor deploy
```

4. **Start development servers**:
```bash
npm run dev
```

### Production Deployment

1. **Using Docker Compose**:
```bash
docker-compose up -d
```

2. **Using Coolify**:
```bash
npm run deploy
```

## Configuration

### Environment Variables

- `SOLANA_RPC_URL`: Solana RPC endpoint
- `VALIDATOR_PUBKEY`: Your validator's public key
- `ALERT_THRESHOLD`: Uptime threshold for alerts (default: 95%)

### Validator Setup

1. Enter your validator's public key in the dashboard
2. Configure alert thresholds
3. Monitor real-time performance metrics

## API Endpoints

- `GET /api/validator/:pubkey/stats` - Get validator statistics
- `POST /api/alerts/threshold` - Update alert threshold
- `GET /api/rewards/history` - Get rewards history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details