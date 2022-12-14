require('dotenv').config();
import type { PlaywrightTestConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TESTS_BASE_URL!;

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./src/tests/ui/global-setup'),
  use: {
    baseURL,
    trace: 'on-first-retry',
    headless: !!process.env.CI,
    ignoreHTTPSErrors: true
  },
  testDir: './src/tests',
  reporter: [
    [
      'html',
      { outputFolder: 'playwright-report' }
    ]
  ],
  timeout: 30000,
  retries: 2,
};
export default config;