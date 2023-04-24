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
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('text=admin (5)').click();
    await page.locator('text=admin').nth(1).click();
    await page.waitForTimeout(200);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    const queryInputValue = await queryInputField.inputValue();
    expect(queryInputValue).toBe('https://graph.microsoft.com/v1.0/admin');
  });

  test('should isolate a resource when the isolate button is clicked', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('text=admin (5)More actions >> [aria-label="More actions"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('button[role="menuitem"]:has-text("Isolate")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('button:has-text("Close isolation")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
  });

  test('should add a resource to collection', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('text=admin (5)').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('text=GETadminMore actions >> [aria-label="More actions"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('button[role="menuitem"]:has-text("Add to collection")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('[aria-label="Preview collection"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("Download Postman collection")').click()
    ]);
    expect(download.suggestedFilename().indexOf('postman_collection.json')).toBeGreaterThan(-1);
    await page.locator('[aria-label="select row"]').click();
    await page.locator('button[role="menuitem"]:has-text("Remove")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
  });

  test('should switch between v1 and beta versions of resources', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('button[role="switch"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    expect(page.locator('label:has-text("On")')).toBeDefined();
  })

  test('should persist storage for resources collection', async () => {
    await page.getByRole('tab', { name: 'Resources Resources xx' }).click();
    await page.getByRole('link', { name: 'admin (5) More actions' }).getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Add to collection' }).click();
    await page.getByRole('menuitem', { name: 'Preview collection' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.reload();

    await page.getByRole('tab', { name: 'Resources Resources xx' }).click();
    expect(page.getByText('Selected Resources (78)')).toBeVisible();
    await page.getByRole('menuitem', { name: 'Preview collection' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.reload();

    await page.getByRole('tab', { name: 'Resources Resources xx' }).click();
    await page.getByRole('button', { name: 'agreements (3)' }).click();
    await page.getByRole('link', { name: 'GET agreements More actions' }).getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Add to collection' }).click();
    await page.reload();

    await page.getByRole('tab', { name: 'Resources Resources xx' }).click();
    await page.getByRole('menuitem', { name: 'Preview collection' }).click();
    expect(page.getByText('GET/v1.0/agreements')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  })
})

test.describe('History tab', () => {
  test('should show added history items to Today\'s collection ', async () => {
    await page.locator('button[role="button"]:has-text("Run query")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('tab', { name: 'History History xx' }).click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    expect(page.locator('span:has-text("Today")')).toBeDefined();
  });
});

test.describe.serial('Sample Query tab', () => {

  test('should select a sample query when clicked', async () => {
    await page.locator('button[role="tab"]:has-text(" Sample queries")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    expect(page.locator('text=Getting Started')).toBeDefined();
    await page.locator('[aria-label="getmy profile"] span:has-text("GET")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('button[role="button"]:has-text("Run query")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    const [page4] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('div[role="gridcell"]:has-text("https://docs.microsoft.com/en-us/graph/api/user-get")').click()
    ]);
    expect(page4).toBeDefined();
  })

  test('should search for a sample query', async () => {
    await page.locator('button[role="tab"]:has-text(" Sample queries")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('[placeholder="Search sample queries"]').click();
    await page.locator('[placeholder="Search sample queries"]').fill('drive');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('[aria-label="list items in my drive"]').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('row', { name: 'OneDrive has 5 results 4 of 6' }).getByRole('button', { name: 'expand collapse group' }).click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('gridcell', { name: 'my recent files' }).click();
    await page.waitForTimeout(200);
    await page.evaluate(() => document.fonts.ready);
  })
})