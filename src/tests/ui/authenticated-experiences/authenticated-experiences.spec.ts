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

test.describe('Run query', () => {

  test('user can run query', async () => {
    const runQueryButton = authenticatedPage.locator('.run-query-button button');
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

  test('should show the permissions panel', async () => {
    const consentToPermissionsButton = authenticatedPage.locator('button:has-text("Consent to permissions")');
    await consentToPermissionsButton.click();
    // eslint-disable-next-line max-len
    await authenticatedPage.locator('div[role="gridcell"]:has-text("APIConnectors.Read.AllAPIConnectors.Read.All")').click();
    // eslint-disable-next-line max-len
    await authenticatedPage.locator('[aria-label="AccessReview has 3 results 2 of 172"] [aria-label="expand collapse group"]').click();
    // eslint-disable-next-line max-len
    await authenticatedPage.locator('div[role="gridcell"]:has-text("AccessReview.Read.AllAccessReview.Read.All")').click();
    // Click [aria-label="Admin consent required"]
    const [consentRequiredDocsPage] = await Promise.all([
      authenticatedPage.waitForEvent('popup'),
      authenticatedPage.locator('[aria-label="Admin consent required"]').click()
    ]);
    expect(consentRequiredDocsPage).toBeDefined();
    const [consentTypeDocsPage] = await Promise.all([
      authenticatedPage.waitForEvent('popup'),
      authenticatedPage.locator('[aria-label="Consent type"]').click()
    ]);
    expect(consentTypeDocsPage).toBeDefined();
  })
})

