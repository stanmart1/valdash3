# Validator Dashboard

A comprehensive Solana validator monitoring dashboard with real-time metrics and MEV insights.

## Features

- **Real-time Validator Monitoring**: Live epoch progress, slot tracking, and network status
- **Performance Metrics**: Block production rates, vote success, uptime tracking
- **Staking Analytics**: Stake amounts, commission rates, rewards, and APR calculations
- **MEV Insights**: Bundle success rates, MEV capture, and additional APR from MEV
- **Searcher Activity**: Arbitrage opportunities, liquidation events, and backrun profits
- **Network Health**: Cluster status, node count, and TPS monitoring
- **Dark/Light Mode**: Toggle between themes for better user experience

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Animations**: Framer Motion
- **Charts**: Recharts

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── ValidatorOverview.tsx
│   ├── PerformanceMetrics.tsx
│   ├── ValidatorStats.tsx
│   ├── MEVInsights.tsx
│   ├── SearcherActivity.tsx
│   └── NetworkStatus.tsx
├── hooks/              # Custom React hooks
│   ├── useValidatorData.ts
│   └── useMEVData.ts
├── utils/              # Utility functions
│   ├── solanaClient.ts
│   └── jitoClient.ts
└── App.tsx             # Main application component
```

## Configuration

The application connects to Solana devnet by default. To change networks, modify `src/utils/solanaClient.ts`:

```typescript
export const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
```

## MEV Integration

The dashboard includes MEV analytics through simulated Jito integration. In production, replace the mock data in `src/utils/jitoClient.ts` with actual Jito API calls.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.