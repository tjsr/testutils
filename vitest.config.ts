import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
    exclude: ['**/node_modules/**', 'dist/**'],
    testTimeout: (process.env['VITEST_VSCODE'] !== undefined ? 120 : 3) * 1000,
  },
});
