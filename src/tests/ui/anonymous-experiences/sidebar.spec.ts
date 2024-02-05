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
    await page.getByLabel('admin (6)').click();
    await page.getByRole('link', { name: 'GET' }).click();
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

  test('should switch between v1 and beta versions of resources', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('button[role="switch"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    expect(page.locator('label:has-text("On")')).toBeDefined();
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
    await page.getByPlaceholder('Search sample queries').click();
    await page.getByPlaceholder('Search sample queries').fill('drive');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('[aria-label="list items in my drive"]').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByLabel('OneDrive has 5 results 4 of').getByLabel('expand collapse group').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByLabel('getmy recent files').click();
    await page.waitForTimeout(200);
    await page.evaluate(() => document.fonts.ready);
  })
})