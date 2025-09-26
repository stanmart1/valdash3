// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';

// Ensure globals are set before any other code runs
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  (window as any).process = {
    env: {},
    browser: true,
    version: '20.18.1',
    versions: { node: '20.18.1' },
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}

export {};