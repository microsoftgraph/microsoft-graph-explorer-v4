require('dotenv').config();
import type { PlaywrightTestConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TESTS_BASE_URL!;

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./src/tests/ui/global-setup'),
  use: {
    baseURL
  },
  testDir: './src/tests',
  reporter: [
    [
      'html',
      { outputFolder: 'playwright-report' }
    ]
  ]
};
export default config;