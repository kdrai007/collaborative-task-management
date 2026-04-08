// =============================================================================
// vitest.config.ts — Test runner configuration for @repo/server
// =============================================================================

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',

    // Global setup: connect MongoDB before all tests, clear between each test
    setupFiles: ['./src/__tests__/setup.ts'],

    // Route tests spin up real Fastify + MongoMemoryServer — allow extra time
    testTimeout: 30_000,

    // Run all test files sequentially so they share ONE MongoMemoryServer instance
    fileParallelism: false,

    // Fast, readable output
    reporters: ['verbose'],
  },
});
