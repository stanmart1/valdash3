import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { connection } from '../utils/solanaClient';

interface ClusterNode {
  pubkey: string;
  gossip: string | null;
  tpu: string | null;
  rpc: string | null;
  version?: string | null;
}

interface NetworkConsensusProps {
  validatorKey?: string;
}

export const NetworkConsensus = ({ validatorKey }: NetworkConsensusProps) => {
  const [clusterNodes, setClusterNodes] = useState<ClusterNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatorPosition, setValidatorPosition] = useState<number | null>(null);

  useEffect(() => {
    const fetchClusterNodes = async () => {
      setLoading(true);
      try {
        const nodes = await connection.getClusterNodes();
        setClusterNodes(nodes);
        
        if (validatorKey) {
          const position = nodes.findIndex(node => node.pubkey === validatorKey);
          setValidatorPosition(position >= 0 ? position + 1 : null);
        }
      } catch (error) {
        console.error('Failed to fetch cluster nodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClusterNodes();
    const interval = setInterval(fetchClusterNodes, 60000);
    return () => clearInterval(interval);
  }, [validatorKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const rpcNodes = clusterNodes.filter(node => node.rpc !== null);
  const totalNodes = clusterNodes.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          🌐 Network Consensus
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
        >
          🔄
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalNodes}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Nodes</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{rpcNodes.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">RPC Nodes</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {validatorPosition || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Your Position</div>
        </div>
      </div>

      {validatorKey && validatorPosition && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✅ Your validator is ranked #{validatorPosition} out of {totalNodes} nodes in the cluster
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Cluster data updated every minute
      </div>
    </motion.div>
  );
};