import { defineConfig, mergeConfig } from 'vitest/config';
import sharedConfig from '@issue-tracker/config/vitest';

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      setupFiles: ['reflect-metadata'],
    },
  })
);
