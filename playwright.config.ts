require('dotenv').config();
import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TESTS_BASE_URL!;

export default defineConfig({
  globalSetup: require.resolve('./src/tests/ui/global-setup'),
  webServer: {
    command: 'npm start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 350 * 1000
  },
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
});