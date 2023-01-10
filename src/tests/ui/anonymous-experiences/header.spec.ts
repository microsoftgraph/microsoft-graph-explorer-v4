import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe('Settings button', () => {
  test('should change theme settings', async () => {

    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();
    const changeThemeButton = page.locator('button[role="menuitem"]:has-text("Change theme")');
    await changeThemeButton.click();
    await page.locator('text=Dark').click();
    const closeThemeDialogButton = page.locator('button:has-text("Close")');
    await closeThemeDialogButton.click();
    await page.locator('[aria-label="Settings"]').click();
    await changeThemeButton.click();
    await page.locator('text=High contrast').click();
    await closeThemeDialogButton.click();
    await settingsButton.click();
    await changeThemeButton.click();
    await page.locator('text=Light').click();
    await page.locator('text=Close').click();
  });

  test('should get a sandbox with sample data', async () => {
    test.slow();
    await page.locator('[aria-label="Settings"]').click();
    // Click text=Get a sandbox with sample data
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Get a sandbox with sample data').click()
    ]);
    expect(page1.url()).toBe('https://developer.microsoft.com/en-US/microsoft-365/dev-program');
  })
})

test.describe('Help button', () => {
  test('should open the relevant help sites',async () => {
    // Click [aria-label="Help"]
    await page.locator('[aria-label="Help"]').click();
    // Click text=Report an Issue
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Report an Issue').click()
    ]);

    // expect the url to contain https://github.com/login
    expect(page1.url().indexOf('https://github.com/login')).toBeGreaterThan(-1);
    // Click [aria-label="Help"]
    await page.locator('[aria-label="Help"]').click();
    // Click text=Get started with Graph Explorer
    const [page2] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Get started with Graph Explorer').click()
    ]);
    expect(page2.url().indexOf('https://learn.microsoft.com/en-us/graph/graph-explorer')).toBeGreaterThan(-1);

    // Click [aria-label="Help"]
    await page.locator('[aria-label="Help"]').click();
    // Click ul[role="presentation"] >> text=Microsoft Graph API Reference
    const [page3] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('ul[role="presentation"] >> text=Microsoft Graph API Reference').click()
    ]);
    expect(page3.url().indexOf('https://learn.microsoft.com/en-us/graph/api')).toBeGreaterThan(-1);

    // Click [aria-label="Help"]
    await page.locator('[aria-label="Help"]').click();
    // Click text=GitHub
    const [page4] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=GitHub').click()
    ]);
    expect(page4.url().indexOf('https://github.com/microsoftgraph/microsoft-graph-explorer')).toBeGreaterThan(-1);
  })
})