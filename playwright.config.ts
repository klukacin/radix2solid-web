import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  testMatch: '**/website.spec.ts',
  use: { baseURL: 'http://127.0.0.1:4149', browserName: 'chromium' },
  projects: [
    { name: 'chromium' },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ],
  webServer: [{
    command: 'pnpm --filter @radix-solid/website preview',
    url: 'http://127.0.0.1:4149/primitives/docs/components/dialog',
    reuseExistingServer: false
  }],
  outputDir: '.artifacts/playwright',
  reporter: 'list'
});
