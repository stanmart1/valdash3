interface JitoMEVData {
  mevCaptured: number;
  bundleSuccessRate: number;
  totalBundles: number;
  successfulBundles: number;
  additionalAPR: number;
}

interface JitoSearcherData {
  opportunitiesDetected: number;
  arbitrageBots: number;
  liquidationEvents: number;
  backrunProfits: number;
}

class JitoClient {

  async getMEVData(validatorKey?: string): Promise<JitoMEVData> {
    if (!validatorKey) {
      throw new Error('Validator key required for MEV data');
    }
    
    try {
      // Real Jito API call would go here
      const response = await fetch(`https://mainnet.block-engine.jito.wtf/api/v1/validators/${validatorKey}/mev`);
      if (!response.ok) {
        throw new Error('Failed to fetch MEV data');
      }
      return await response.json();
    } catch (error) {
      console.error('Jito API error:', error);
      throw new Error('MEV data unavailable - configure Jito Labs API key');
    }
  }

  async getSearcherActivity(validatorKey?: string): Promise<JitoSearcherData> {
    if (!validatorKey) {
      throw new Error('Validator key required for searcher data');
    }
    
    try {
      const response = await fetch(`https://mainnet.block-engine.jito.wtf/api/v1/validators/${validatorKey}/searchers`);
      if (!response.ok) {
        throw new Error('Failed to fetch searcher data');
      }
      return await response.json();
    } catch (error) {
      console.error('Jito searcher API error:', error);
      throw new Error('Searcher data unavailable - configure Jito Labs API key');
    }
  }

  async getBundleStats(validatorKey?: string) {
    if (!validatorKey) {
      throw new Error('Validator key required for bundle stats');
    }
    
    try {
      const response = await fetch(`https://mainnet.block-engine.jito.wtf/api/v1/validators/${validatorKey}/bundles`);
      if (!response.ok) {
        throw new Error('Failed to fetch bundle statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Jito bundle stats error:', error);
      throw new Error('Bundle stats unavailable - configure Jito Labs API key');
    }
  }
}

export const jitoClient = new JitoClient();