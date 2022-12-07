import AxeBuilder from '@axe-core/playwright';
import { test, expect, Page } from '@playwright/test';

const TEST_TIMEOUT_MS = 500000; // in milliseconds = 5min

describe('Graph Explorer accessibility', () => {
  let driver: ThenableWebDriver;
  jest.setTimeout(TEST_TIMEOUT_MS);

  // set browser environment to use headless Chrome
  beforeAll(async () => {

  test('should not have any automatically detectable accessibility issues', async () => {

    await page.locator('[aria-label="Settings"]').isVisible();
    const accessibilityScan = new AxeBuilder({ page }).setLegacyMode();
    const result = await accessibilityScan
      .disableRules([
        'landmark-one-main',
        'region',
        'document-title',
        'html-has-lang',
        'page-has-heading-one',
        'landmark-unique',
        'aria-required-children'
      ])
      .analyze();
    accessibilityScan.setLegacyMode(false);

    expect(result.violations).toEqual([]);
  });
})