/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_NETWORK: string
  readonly VITE_SOLANA_RPC_URL: string
  readonly VITE_HELIUS_API_KEY: string
  readonly VITE_JITO_API_KEY: string
  readonly VITE_SOLANAFM_API_KEY: string
  readonly VITE_SHYFT_API_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}