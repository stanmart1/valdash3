interface ApiConfig {
  provider: 'helius' | 'jito' | 'solanafm' | 'shyft';
  apiKey: string;
  network: 'mainnet' | 'devnet' | 'testnet';
}

class PremiumDataClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  updateConfig(config: ApiConfig) {
    this.config = config;
  }

  async getEnhancedValidatorData(validatorKey: string) {
    if (!this.config.apiKey) return null;
    
    switch (this.config.provider) {
      case 'helius':
        return this.fetchFromHelius(validatorKey);
      case 'jito':
        return this.fetchFromJito(validatorKey);
      case 'solanafm':
        return this.fetchFromSolanaFM(validatorKey);
      case 'shyft':
        return this.fetchFromShyft(validatorKey);
      default:
        return null;
    }
  }

  private async fetchFromHelius(validatorKey: string) {
    try {
      const response = await fetch(`https://api.helius.xyz/v0/validators/${validatorKey}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      if (!response.ok) throw new Error('Helius API error');
      return await response.json();
    } catch (error) {
      console.error('Helius API error:', error);
      throw new Error('Helius data unavailable');
    }
  }

  private async fetchFromJito(validatorKey: string) {
    try {
      const response = await fetch(`https://mainnet.block-engine.jito.wtf/api/v1/validators/${validatorKey}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      if (!response.ok) throw new Error('Jito API error');
      return await response.json();
    } catch (error) {
      console.error('Jito API error:', error);
      throw new Error('Jito data unavailable');
    }
  }

  private async fetchFromSolanaFM(validatorKey: string) {
    try {
      const response = await fetch(`https://api.solana.fm/v1/validators/${validatorKey}`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      if (!response.ok) throw new Error('SolanaFM API error');
      return await response.json();
    } catch (error) {
      console.error('SolanaFM API error:', error);
      throw new Error('SolanaFM data unavailable');
    }
  }

  private async fetchFromShyft(validatorKey: string) {
    try {
      const response = await fetch(`https://api.shyft.to/sol/v1/validator/${validatorKey}`, {
        headers: { 'x-api-key': this.config.apiKey }
      });
      if (!response.ok) throw new Error('Shyft API error');
      return await response.json();
    } catch (error) {
      console.error('Shyft API error:', error);
      throw new Error('Shyft data unavailable');
    }
  }

  getNetworkEndpoint(): string {
    const endpoints = {
      mainnet: 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com',
      testnet: 'https://api.testnet.solana.com',
    };

    if (!this.config.apiKey) {
      return endpoints[this.config.network];
    }

    switch (this.config.provider) {
      case 'helius':
        return `https://rpc.helius.xyz/?api-key=${this.config.apiKey}`;
      default:
        return endpoints[this.config.network];
    }
  }

  hasApiKeys(): boolean {
    return !!this.config.apiKey;
  }
}

export const createPremiumDataClient = (config: ApiConfig) => new PremiumDataClient(config);