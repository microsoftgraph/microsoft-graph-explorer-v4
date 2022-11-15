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
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    [
      'html',
      { outputFolder: 'playwright-report' }
    ]
  ]
};
export default config;