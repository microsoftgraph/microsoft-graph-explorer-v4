/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe('Resources Explorer', () => {
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

test.describe('History tab', () => {
  test('should show added history items to Today\'s collection ', async () => {
    await page.locator('button[role="button"]:has-text("Run query")').click();
    await page.locator('text= Sample queries Resources History >> [aria-label="More items"]').click();
    await page.locator('button[role="menuitem"]:has-text("History")').click();
    expect(page.locator('span:has-text("Today")')).toBeDefined();
  });
});

test.describe('Sample Query tab', () => {

  test('should select a sample query when clicked', async () => {
    await page.locator('button[role="tab"]:has-text(" Sample queries")').click();
    expect(page.locator('text=Getting Started')).toBeDefined();
    // Click [aria-label="getmy profile"] span:has-text("GET")
    await page.locator('[aria-label="getmy profile"] span:has-text("GET")').click();
    // Click button[role="button"]:has-text("Run query")
    await page.locator('button[role="button"]:has-text("Run query")').click();
    // Click div[role="gridcell"]:has-text("https://docs.microsoft.com/en-us/graph/api/user-get")
    const [page4] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('div[role="gridcell"]:has-text("https://docs.microsoft.com/en-us/graph/api/user-get")').click()
    ]);
    // expect(page4.url().indexOf('https://learn.microsoft.com/en-us/graph/api/user-get')).toBeGreaterThan(-1);
    // Click [aria-label="Applications has 8 results 2 of 29"] [aria-label="expand collapse group"]
    await page.locator('[aria-label="Applications has 8 results 2 of 29"] [aria-label="expand collapse group"]').click();
    // Click [aria-label="postcreate a new application"] div[role="gridcell"]:has-text("Sign in to try this sample")
    expect(page.locator('[aria-label="postcreate a new application"] div[role="gridcell"]:has-text("Sign in to try this sample")')).toBeDefined();
    // Click text=Microsoft Graph API Reference docs.
    const [page5] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Microsoft Graph API Reference docs.').click()
    ]);
    // expect(page5.url().indexOf('https://learn.microsoft.com/en-us/graph/api/overview')).toBeGreaterThan(-1);
  })

  test('should search for a sample query', async () => {
    await page.locator('button[role="tab"]:has-text(" Sample queries")').click();
    // Click [placeholder="Search sample queries"]
    await page.locator('[placeholder="Search sample queries"]').click();
    // Fill [placeholder="Search sample queries"]
    await page.locator('[placeholder="Search sample queries"]').fill('drive');
    // Click [aria-label="all the items in my drive"]
    await page.locator('[aria-label="all the items in my drive"]').click();
    // Click [aria-label="OneDrive has 5 results 4 of 5"] [aria-label="expand collapse group"]
    await page.locator('[aria-label="OneDrive has 5 results 4 of 5"] [aria-label="expand collapse group"]').click();
    // Click [aria-label="my recent files"]
    await page.locator('[aria-label="my recent files"]').click();
  })
})