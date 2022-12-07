import { test, expect, Page } from '@playwright/test';
import { logIn } from './login';

let authenticatedPage: Page;

test.beforeAll(async ({ browser }) => {
  test.slow();
  authenticatedPage = await browser.newPage();
  await logIn(authenticatedPage);
  await authenticatedPage.waitForTimeout(5000);
});

test.describe('Settings', () => {

  test('Change theme settings', async () => {

    const settingsButton = await authenticatedPage.locator('[aria-label="Settings"]');
    await settingsButton.click();
    const changeThemeButton = await authenticatedPage.locator('button[role="menuitem"]:has-text("Change theme")');
    await changeThemeButton.click();
    await authenticatedPage.locator('text=Dark').click();
    const closeThemeDialogButton = await authenticatedPage.locator('button:has-text("Close")');
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
    await authenticatedPage.waitForTimeout(100);
    const messageBar = await  authenticatedPage.locator('.ms-MessageBar-content');
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
