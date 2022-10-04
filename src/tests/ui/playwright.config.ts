import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const baseURL = 'http://localhost:3000';
const config: PlaywrightTestConfig = {
  use: {
    baseURL
  },
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