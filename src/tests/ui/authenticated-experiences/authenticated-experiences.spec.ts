/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';
import { logIn } from '../login';
require('dotenv').config();

let authenticatedPage: Page;

test.beforeAll(async ({ browser }) => {
  authenticatedPage = await browser.newPage();
  await logIn(authenticatedPage);
});

test.describe('Run query', () => {

  test('user can run query', async () => {
    const runQueryButton = authenticatedPage.locator('.run-query-button button');
    await runQueryButton.click();
    await authenticatedPage.waitForTimeout(100);
    await authenticatedPage.evaluate(() => document.fonts.ready);
    expect(await authenticatedPage.screenshot()).toMatchSnapshot();
    const messageBar = authenticatedPage.locator('.ms-MessageBar-content');
    expect(messageBar).toBeDefined();
    await expect(authenticatedPage.locator('text=/.*"displayName": "Megan Bowen".*/')).not.toBeVisible();
  });

});

test.describe('Request', () => {
  test('Access token is available and is decodeable', async () => {
    await authenticatedPage.locator('[aria-label="Access token"]').click();
    await authenticatedPage.locator('[aria-label="Copy"]').click();
    const [page5] = await Promise.all([
      authenticatedPage.waitForEvent('popup'),
      authenticatedPage.locator('[aria-label="Get token details \\(Powered by jwt\\.ms\\)"]').click()
    ]);
    expect(page5.url().indexOf('https://jwt.ms/')).toBeGreaterThan(-1);
  })
})

test.describe.serial('Profile', () => {
  test('should show profile', async () => {
    await authenticatedPage.locator('[aria-label="profile"]').click();
    await expect(authenticatedPage.locator('button:has-text("Consent to permissions")')).toBeVisible();
  });

  test('should open the permissions panel', async () => {
    await authenticatedPage.locator('button:has-text("Consent to permissions")').click();
    await authenticatedPage.waitForTimeout(500);
    await authenticatedPage.evaluate(() => document.fonts.ready);
    expect(await authenticatedPage.screenshot()).toMatchSnapshot();
    await authenticatedPage.waitForTimeout(500);
    expect(authenticatedPage.locator('div[role="heading"]:has-text("Permissions")')).toBeDefined();
  })
})

