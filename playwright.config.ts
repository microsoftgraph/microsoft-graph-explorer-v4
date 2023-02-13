require('dotenv').config();
import type { PlaywrightTestConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TESTS_BASE_URL!;

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./src/tests/ui/global-setup'),
  expect: {
    toMatchSnapshot: {
      threshold: 0.3,
      maxDiffPixelRatio: 0.02
    }
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    headless: !!process.env.CI,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure'
  },
  testDir: './src/tests',
  reporter: [
    [
      'html',
      { outputFolder: 'playwright-report' }
    ]
  ],
  retries: 1,
  timeout: 60000
};
export default config;