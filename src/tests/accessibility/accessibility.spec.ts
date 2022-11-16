import AxeBuilder from '@axe-core/playwright';
import { test, expect, Page } from '@playwright/test';

const TEST_TIMEOUT_MS = 500000; // in milliseconds = 5min

describe('Graph Explorer accessibility', () => {
  let driver: ThenableWebDriver;
  jest.setTimeout(TEST_TIMEOUT_MS);

test.describe('Accessibility', () => {
  test.use({ viewport: { width: 1024, height: 768 }});

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
        'aria-allowed-attr',
        'aria-required-children',
        'color-contrast',
        'aria-conditional-attr'
      ])
      .analyze();
    accessibilityScan.setLegacyMode(false);

    expect(result.violations).toEqual([]);
  });
})