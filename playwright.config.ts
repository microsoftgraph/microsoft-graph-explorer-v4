require('dotenv').config();
import type { PlaywrightTestConfig } from '@playwright/test';

const baseURL = 'https://developer.microsoft.com/en-us/graph/graph-explorer';

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
  retries: 2
};
export default config;