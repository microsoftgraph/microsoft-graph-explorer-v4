import { test, expect, Page } from '@playwright/test';
require('dotenv').config();

let authenticatedPage: Page;
const PLAYWRIGHT_TESTS_USERNAME = process.env.PLAYWRIGHT_TESTS_USERNAME || '';
const PLAYWRIGHT_TESTS_PASSWORD = process.env.PLAYWRIGHT_TESTS_PASSWORD || '';

test.beforeAll(async ({ browser }) => {
  authenticatedPage = await browser.newPage();
  await authenticatedPage.goto('/');

  const [popup] = await Promise.all([
    authenticatedPage.waitForEvent('popup'),
    authenticatedPage.locator('[aria-label="Sign in"]').click()
  ]);

  await popup.locator('input[name="loginfmt"]').fill(PLAYWRIGHT_TESTS_USERNAME);
  await popup.locator('text=Next').click();

  await popup.locator('[placeholder="Password"]').fill(PLAYWRIGHT_TESTS_PASSWORD);
  await popup.locator('text=Sign in').click();

  await expect(popup).toHaveURL('https://login.microsoftonline.com/common/login');
  await popup.locator('text=Yes').click();
});

test.describe('Settings', () => {

  test('Change theme settings', async () => {

    const settingsButton = await authenticatedPage.locator('[aria-label="Settings"]');
    await settingsButton.click();
    const changeThemeButton = authenticatedPage.locator('button[role="menuitem"]:has-text("Change theme")');
    await changeThemeButton.click();
    await authenticatedPage.locator('text=Dark').click();
    const closeThemeDialogButton = authenticatedPage.locator('button:has-text("Close")');
    await closeThemeDialogButton.click();
    await authenticatedPage.locator('[aria-label="Settings"]').click();
    await changeThemeButton.click();
    await authenticatedPage.locator('text=High contrast').click();
    await closeThemeDialogButton.click();
    await settingsButton.click();
    await changeThemeButton.click();
    await authenticatedPage.locator('text=Light').click();
    await authenticatedPage.locator('text=Close').click();
  });


})

test.describe('Run query', () => {

  test('user can run query', async () => {
    const runQueryButton = await authenticatedPage.locator('.run-query-button button');
    await runQueryButton.click();
    // eslint-disable-next-line max-len
    await authenticatedPage.waitForTimeout(100);
    const messageBar = authenticatedPage.locator('.ms-MessageBar-content');
    expect(messageBar).toBeDefined();
    await expect(authenticatedPage.locator('text=/.*"displayName": "Megan Bowen".*/')).not.toBeVisible();
  });

});

test.describe('Profile', () => {
  test('should show profile', async () => {
    await authenticatedPage.locator('[aria-label="profile"]').click();
    await expect(authenticatedPage.locator('button:has-text("Consent to permissions")')).toBeVisible();
  });
})
