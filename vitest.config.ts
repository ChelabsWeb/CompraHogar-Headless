import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      'server-only': require.resolve('vitest'), // Resolves to an existing module to avoid evaluation of throwing index.js
    },
  },
});
