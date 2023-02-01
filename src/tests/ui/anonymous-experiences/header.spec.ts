/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

// await expect(authenticatedPage).toHaveScreenshot('runQuery.png', { clip: { x: 0, y: 0, width: 1920, height: 400 } });

test.describe('Settings button', () => {
  test('should change theme settings', async () => {

    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();
    const changeThemeButton = page.locator('button[role="menuitem"]:has-text("Change theme")');
    await changeThemeButton.click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('text=Dark').click();
    const closeThemeDialogButton = page.locator('button:has-text("Close")');
    await closeThemeDialogButton.click();
    await page.locator('[aria-label="Settings"]').click();
    await changeThemeButton.click();
    await page.locator('text=High contrast').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await closeThemeDialogButton.click();
    await settingsButton.click();
    await changeThemeButton.click();
    await page.locator('text=Light').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('text=Close').click();
  });

  test('should get a sandbox with sample data', async () => {
    test.slow();
    await page.locator('[aria-label="Settings"]').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Get a sandbox with sample data').click()
    ]);
    expect(page1.url()).toBe('https://developer.microsoft.com/en-US/microsoft-365/dev-program');
  })
})

test.describe('Help button', () => {
  test('should open the relevant help sites',async () => {
    await page.locator('[aria-label="Help"]').click();
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Report an Issue').click()
    ]);

    expect(page1.url().indexOf('https://github.com/login')).toBeGreaterThan(-1);
    await page.locator('[aria-label="Help"]').click();
    const [page2] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Get started with Graph Explorer').click()
    ]);
    expect(page2.url().indexOf('https://learn.microsoft.com/en-us/graph/graph-explorer')).toBeGreaterThan(-1);

    await page.locator('[aria-label="Help"]').click();
    const [page3] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('ul[role="presentation"] >> text=Microsoft Graph API Reference').click()
    ]);
    expect(page3.url().indexOf('https://learn.microsoft.com/en-us/graph/api')).toBeGreaterThan(-1);

    await page.locator('[aria-label="Help"]').click();
    const [page4] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=GitHub').click()
    ]);
    expect(page4.url().indexOf('https://github.com/microsoftgraph/microsoft-graph-explorer')).toBeGreaterThan(-1);
  })
})

test.describe('Feedback button', () => {
  test('should provide feedback', async () => {
    await page.locator('[aria-label="Help Improve Graph Explorer\\?"]').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('.obf-ChoiceGroupIcon').first().click();
    await page.locator('[aria-label="Tell us more about your experience"]').click();
    await page.locator('[aria-label="Tell us more about your experience"]').fill('Ge is just so simple to use');
    await page.locator('input[type="checkbox"]').check();
    await page.locator('[placeholder="Email \\(optional\\)"]').click();
    await page.locator('[placeholder="Email \\(optional\\)"]').fill(' dummyemail@email.com');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('text=Submit').click();
    const response = page.locator('text=Graph Explorer Feedback - Submitted Successfully');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect(await response.isVisible()).toBeTruthy();
  })
})

test.describe('Sign in button', () => {
  test('should launch the sign in popup', async () => {
    const [page2] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('[aria-label="Sign in"]').click()
    ]);
    expect(page2).toBeDefined();
  })
})