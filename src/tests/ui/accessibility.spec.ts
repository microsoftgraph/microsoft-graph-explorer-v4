import AxeBuilder from '@axe-core/playwright';
import { test, expect, Page } from '@playwright/test';


let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
  console.log('Here is the page ', page.url())
});

test.describe('Accessibility', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test('should not have any automatically detectable accessibility issues', async () => {
    test.setTimeout(150000);
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