import { motion, AnimatePresence } from 'framer-motion';
import { QuickStats } from './QuickStats';
import { ValidatorOverview } from './ValidatorOverview';
import { PerformanceMetrics } from './PerformanceMetrics';
import { ValidatorStats } from './ValidatorStats';
import { StakingRewards } from './StakingRewards';
import { MEVInsights } from './MEVInsights';
import { SearcherActivity } from './SearcherActivity';
import { NetworkStatus } from './NetworkStatus';
import { NetworkHealth } from './NetworkHealth';
import { EpochProgress } from './EpochProgress';
import { NetworkConsensus } from './NetworkConsensus';

interface TabContentProps {
  activeTab: string;
  validatorKey: string;
}

const tabVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const TabContent = ({ activeTab, validatorKey }: TabContentProps) => {
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Tab Description */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-xl mt-0.5">💡</div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Overview Dashboard
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Get a comprehensive view of network statistics, validator status, and real-time performance metrics. 
              {validatorKey ? 'Your validator data is being displayed with live updates.' : 'Enter a validator public key above to see personalized metrics and detailed performance data.'}
            </p>
          </div>
        </div>
      </div>
      
      <QuickStats validatorKey={validatorKey} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <ValidatorOverview validatorKey={validatorKey} />
        </div>
        <div>
          <EpochProgress validatorKey={validatorKey} />
        </div>
        <div>
          <PerformanceMetrics validatorKey={validatorKey} />
        </div>
      </div>
    </div>
  );

  const renderStakingTab = () => (
    <div className="space-y-6">
      {/* Tab Description */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-green-500 text-xl mt-0.5">💰</div>
          <div>
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
              Staking & Rewards Analytics
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Monitor staking performance, commission rates, epoch rewards, and APR calculations. 
              {validatorKey ? 'Track your validator\'s profitability and staking efficiency with real-time data from the Solana network.' : 'Enter your validator key to see detailed staking statistics, reward history, and commission analysis.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ValidatorStats validatorKey={validatorKey} />
        </div>
        <div>
          <PerformanceMetrics validatorKey={validatorKey} />
        </div>
      </div>
      <StakingRewards validatorKey={validatorKey} />
    </div>
  );

  const renderMEVTab = () => (
    <div className="space-y-6">
      {/* Tab Description */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-purple-500 text-xl mt-0.5">🚀</div>
          <div>
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
              MEV Analytics & Insights
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Explore Maximum Extractable Value (MEV) opportunities, bundle success rates, and additional APR from MEV rewards. 
              {validatorKey ? 'View your validator\'s MEV performance and searcher activity with Jito integration data.' : 'This section shows network-wide MEV activity. Enter a validator key to see personalized MEV capture and bundle statistics.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <MEVInsights validatorKey={validatorKey} />
        </div>
        <div className="lg:col-span-2">
          <SearcherActivity validatorKey={validatorKey} />
        </div>
      </div>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-6">
      {/* Tab Description */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-cyan-500 text-xl mt-0.5">🌐</div>
          <div>
            <h3 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 mb-1">
              Network Health & Consensus
            </h3>
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              Monitor Solana network health, cluster status, TPS performance, and consensus metrics. 
              {validatorKey ? 'See how your validator contributes to network stability and consensus participation.' : 'View real-time network statistics including validator count, total stake, and transaction throughput.'}
            </p>
          </div>
        </div>
      </div>
      
      <NetworkHealth validatorKey={validatorKey} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <NetworkConsensus validatorKey={validatorKey} />
        </div>
        <div>
          <NetworkStatus />
        </div>
        <div className="lg:col-span-2">
          <EpochProgress validatorKey={validatorKey} />
        </div>
      </div>
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'staking':
        return renderStakingTab();
      case 'mev':
        return renderMEVTab();
      case 'network':
        return renderNetworkTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="mt-8"
      >
        {getTabContent()}
      </motion.div>
    </AnimatePresence>
  );
};