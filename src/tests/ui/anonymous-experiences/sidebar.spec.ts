/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe.skip('Resources Explorer', () => {
  test('should open the resources explorer when the resources explorer button is clicked', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('text=admin (3)').click();
    await page.locator('text=admin').nth(1).click();
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    const queryInputValue = await queryInputField.inputValue();
    expect(queryInputValue).toBe('https://graph.microsoft.com/v1.0/admin');
  });

  test('should isolate a resource when the isolate button is clicked', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('text=admin (3)More actions >> [aria-label="More actions"]').click();
    await page.locator('button[role="menuitem"]:has-text("Isolate")').click();
    await page.locator('button:has-text("Close isolation")').click();
  });

  test('should add a resource to collection', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('text=admin (3)').click();
    await page.locator('text=GETadminMore actions >> [aria-label="More actions"]').click();
    await page.locator('button[role="menuitem"]:has-text("Add to collection")').click();
    await page.locator('[aria-label="Preview collection"]').click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("Download Postman collection")').click()
    ]);
    expect(download.suggestedFilename().indexOf('postman_collection.json')).toBeGreaterThan(-1);
    await page.locator('[aria-label="select row"]').click();
    await page.locator('button[role="menuitem"]:has-text("Remove")').click();
  });

  test('should switch between v1 and beta versions of resources', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('button[role="switch"]').click();
    expect(page.locator('label:has-text("On")')).toBeDefined();
  })
})

test.describe.skip('History tab', () => {
  test('should show added history items to Today\'s collection ', async () => {
    await page.locator('button[role="button"]:has-text("Run query")').click();
    await page.locator('text= Sample queries Resources History >> [aria-label="More items"]').click();
    await page.locator('button[role="menuitem"]:has-text("History")').click();
    expect(page.locator('span:has-text("Today")')).toBeDefined();
  });
});