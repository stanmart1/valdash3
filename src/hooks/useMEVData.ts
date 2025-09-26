import { useState, useEffect } from 'react';
import { jitoClient } from '../utils/jitoClient';

interface MEVData {
  mevCaptured: number;
  bundleSuccessRate: number;
  additionalAPR: number;
}

interface SearcherActivity {
  opportunitiesDetected: number;
  arbitrageBots: number;
  liquidationEvents: number;
  backrunProfits: number;
}

interface MEVHookData {
  mevData: MEVData | null;
  searcherActivity: SearcherActivity | null;
  isLoading: boolean;
  error: string | null;
}

export const useMEVData = () => {
  const [data, setData] = useState<MEVHookData>({
    mevData: null,
    searcherActivity: null,
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [jitoMEVData, jitoSearcherData] = await Promise.all([
        jitoClient.getMEVData(),
        jitoClient.getSearcherActivity(),
      ]);
      
      const mevData: MEVData = {
        mevCaptured: jitoMEVData.mevCaptured,
        bundleSuccessRate: jitoMEVData.bundleSuccessRate,
        additionalAPR: jitoMEVData.additionalAPR,
      };
      
      const searcherActivity: SearcherActivity = {
        opportunitiesDetected: jitoSearcherData.opportunitiesDetected,
        arbitrageBots: jitoSearcherData.arbitrageBots,
        liquidationEvents: jitoSearcherData.liquidationEvents,
        backrunProfits: jitoSearcherData.backrunProfits,
      };

      setData({
        mevData,
        searcherActivity,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch MEV data',
      }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return { ...data, refetch: fetchData };
};