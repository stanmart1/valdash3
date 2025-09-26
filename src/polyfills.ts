// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';

// Make Buffer available globally
(window as any).global = window;
(window as any).Buffer = Buffer;
(window as any).process = {
  env: {},
  browser: true,
  version: '',
  versions: { node: '20.18.1' }
};

export {};