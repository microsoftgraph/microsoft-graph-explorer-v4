require('dotenv').config();
import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TESTS_BASE_URL!;

const config: PlaywrightTestConfig = {
  use: {
    baseURL
  },
  testDir: './src/tests',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
};
export default config;