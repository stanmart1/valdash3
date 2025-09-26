import { useState, useEffect } from 'react';
import { fetchMEVData, fetchSearcherActivity, MEVData, SearcherActivity } from '../utils/jitoClient';

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
      
      const [mevData, searcherActivity] = await Promise.all([
        fetchMEVData(),
        fetchSearcherActivity(),
      ]);

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