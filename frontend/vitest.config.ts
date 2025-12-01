import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts', // if you have global test setup
    include: ['tests/unit/**/*.test.ts?(x)'],
    exclude: ['tests/acceptance/**'],
  },
});