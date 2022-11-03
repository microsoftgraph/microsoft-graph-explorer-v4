import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test.skip('should not have any automatically detectable accessibility issues', async ({ page }) => {

    await page.goto('/');
    await page.waitForTimeout(500);
    test.slow();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules([
        'landmark-one-main',
        'region',
        'document-title',
        'html-has-lang',
        'page-has-heading-one',
        'landmark-unique',
        'aria-allowed-attr',
        'aria-required-children'
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
})