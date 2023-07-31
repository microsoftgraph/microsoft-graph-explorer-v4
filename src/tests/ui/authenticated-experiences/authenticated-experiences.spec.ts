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

  test('Run query button does not hung on queries that return 401 or 403 results', async () => {
    await authenticatedPage.getByRole('textbox', { name: 'Read documentation' }).click();
    await authenticatedPage.locator('.ms-TextField-fieldGroup').click();
    await authenticatedPage.getByRole('textbox', { name: 'Read documentation' }).clear();
    await authenticatedPage.getByRole('textbox', { name: 'Read documentation' }).fill('https://graph.microsoft.com/v1.0/deviceAppManagement/managedAppPolicies');
    await authenticatedPage.getByRole('button', { name: 'Run query' }).click();
    expect(authenticatedPage.getByText('"Forbidden"')).toBeDefined();
    expect(authenticatedPage.getByRole('button', { name: 'Run query' })).toBeDefined();
  })

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

  test('Permissions tab asks user to open permissions panel to view more permissions if missing on the tab', async () => {
    const queryInput = authenticatedPage.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/userssssss');
    await authenticatedPage.locator('[aria-label="Modify permissions"]').click();
    await authenticatedPage.evaluate(() => document.fonts.ready);
    await authenticatedPage.waitForTimeout(100);
    expect(authenticatedPage.getByText('Permissions for the query are missing on this tab. Open the permissions panel to')).toBeDefined();
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

