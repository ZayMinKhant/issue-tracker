import path from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import sharedConfig from '@issue-tracker/config/vitest';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
);
