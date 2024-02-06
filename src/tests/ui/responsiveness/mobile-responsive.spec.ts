/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

test.use({
  viewport: {
    height: 914,
    width: 412
  }
});

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});


test.describe('Sidebar navigation', () => {
  test('should have sample queries tab', async () => {
    await page.getByRole('button', { name: 'Minimize sidebar' }).click();
    await page.getByRole('tab', { name: 'Sample queries Sample queries xx' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    expect(page.getByRole('gridcell', { name: 'my profile' }).filter({ hasText: 'my profileGET my profile' })).toBeDefined();
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('gridcell', { name: 'my profile' }).filter({ hasText: 'my profileGET my profile' }).click();
    await page.getByRole('button', { name: 'Run query' }).click();
  })
  test('should have resources tab', async () => {
    await page.getByRole('button', { name: 'Minimize sidebar' }).click();
    await page.getByRole('tab', { name: 'Resources Resources xx' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: 'applications (8)' }).click();
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('button', { name: 'Minimize sidebar' }).click();
  })
  test('should have history tab', async () => {
    await page.getByRole('button', { name: 'Minimize sidebar' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('tab', { name: 'History History xx' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    page.getByText('Today');
    expect(await page.screenshot()).toMatchSnapshot();
    expect(page.locator('span:has-text("Today")')).toBeDefined();
    await page.getByRole('button', { name: 'Minimize sidebar' }).click();
  })
});

test.describe('Request area navigation', () => {
  test('should have permissions tab in overflow menu', async () => {
    await page.getByLabel('More request area items').click();
    await page.getByRole('menuitem', { name: 'Modify permissions' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    page.locator('span').filter({ hasText: 'Directory.Read.All' });
    expect(await page.screenshot()).toMatchSnapshot();
  })

  test('should have access token tab in overflow menu', async () => {
    await page.getByLabel('More request area items').click();
    await page.getByRole('menuitem', { name: 'Access token' }).click();
    page.getByText('To view your access token, sign in to Graph Explorer.');
    expect(await page.screenshot()).toMatchSnapshot();
  })
});
test.describe('Response area navigation', () => {
  test('should have code snippets tab in overflow menu', async () => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Code snippets' }).click();
    await page.getByRole('tab', { name: 'C# C#' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    expect(await page.screenshot()).toMatchSnapshot();
  })
  test('should have adaptive card tab in overflow menu', async () => {
    await page.getByRole('button', { name: 'Minimize sidebar' }).click();
    await page.getByRole('tab', { name: 'Sample queries Sample queries xx' }).click();
    await page.getByRole('gridcell', { name: 'my profile' }).filter({ hasText: 'my profileGET my profile' }).click();
    await page.getByRole('button', { name: 'Run query' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Adaptive cards' }).click();
    await page.getByRole('tabpanel', { name: 'Adaptive cards' }).getByRole('tab', { name: 'Card' }).click();
    expect(page.getByText('Megan Bowen')).toBeDefined();
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('tab', { name: 'JSON template' }).click();
    expect(page.getByText('Get started with adaptive cards on Adaptive Cards Templating SDK and experiment ')).toBeDefined();
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
  })
  test('should have toolkit component tab in overflow menu', async () => {
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Toolkit component' }).click();
    await page.waitForTimeout(700);
    await page.evaluate(() => document.fonts.ready);
    expect(page.locator('text=Open this example in')).toBeDefined();
    expect(await page.screenshot()).toMatchSnapshot();
  });
  test('should have expand component tab in overflow menu', async () => {
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Expand response' }).click();
    await page.getByRole('tab', { name: 'More items' }).click();
    await page.getByRole('menuitem', { name: 'Code snippets' }).click();
    await page.getByRole('tab', { name: 'C# C#' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('button', { name: 'Close expanded response area' }).click();
  });
});