import { defineConfig } from '@playwright/test';

// WEBSITE_PREVIEW_PORT is inherited by the preview webServer (scripts/serve.ts) and the spec workers.
const origin = `http://127.0.0.1:${process.env.WEBSITE_PREVIEW_PORT ?? 4149}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  testMatch: '**/website.spec.ts',
  use: {
    baseURL: origin,
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ],
  webServer: [{
    command: 'pnpm --filter @radix-solid/website preview',
    url: `${origin}/primitives/docs/components/dialog`,
    reuseExistingServer: false
  }],
  outputDir: '.artifacts/playwright',
  reporter: 'list'
});
