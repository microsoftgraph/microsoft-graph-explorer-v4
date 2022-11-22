import { test, expect, Page } from '@playwright/test';
import { logIn } from './login';

let authenticatedPage: Page;

test.beforeAll(async ({ browser }) => {
  authenticatedPage = await browser.newPage();
  await logIn(authenticatedPage);
  await authenticatedPage.waitForTimeout(5000);
});

test.describe('Sample Queries', () => {

  test('Sign in tooltip should not be visible', async () => {
    test.slow();
    await authenticatedPage
      .locator('[aria-label="Applications has 8 results 2 of 28"] [aria-label="expand collapse group"]')
      .click();
    await expect(authenticatedPage
      // eslint-disable-next-line max-len
      .locator('[aria-label="patchupdate application properties"] div[role="gridcell"]:has-text("Sign in to try this sample")'))
      .not.toBeVisible();
  });

});

test.describe('Settings', () => {

  test('Change theme settings', async () => {

    const settingsButton = authenticatedPage.locator('[aria-label="Settings"]');
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
    const runQueryButton = authenticatedPage.locator('.run-query-button button');
    await runQueryButton.click();
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
