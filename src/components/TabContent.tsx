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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <MEVInsights validatorKey={validatorKey} />
      </div>
      <div className="lg:col-span-2">
        <SearcherActivity validatorKey={validatorKey} />
      </div>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-6">
      <NetworkHealth validatorKey={validatorKey} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <NetworkStatus />
        </div>
        <div>
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