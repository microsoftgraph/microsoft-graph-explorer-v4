import AxeBuilder from '@axe-core/playwright';
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('/');
});

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