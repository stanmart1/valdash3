import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.browser': true,
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process',
      stream: 'stream-browserify',
      util: 'util',
      crypto: 'crypto-browserify',
      vm: 'vm-browserify',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'crypto-browserify', 'vm-browserify'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'solana-web3': ['@solana/web3.js'],
          'ui-components': ['framer-motion', 'recharts']
        }
      }
    }
  }
})