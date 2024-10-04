require('dotenv').config();
import { PlaywrightTestConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TESTS_BASE_URL!;

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./src/tests/ui/global-setup'),
  expect: {
    toMatchSnapshot: {
      threshold: 0.3,
      maxDiffPixelRatio: 0.05
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
  testIgnore: '**/authenticated-experiences/**',
  reporter: [
    [
      'html',
      { outputFolder: 'playwright-report' }
    ]
  ],
  retries: 1,
  timeout: 60000,
  projects: [
    {
      name: 'Ms-Edge',
      use: {
        channel: 'msedge',
        viewport: { width: 1920, height: 1080 }}
    },
    {
      name: 'Chrome',
      use: {
        channel: 'chrome',
        viewport: { width: 1365, height: 768 }}
    }
  ]
};
export default config;