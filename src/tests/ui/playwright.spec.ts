import { test, expect, Page } from '@playwright/test';
import { logIn } from './login';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await logIn(page);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Sample Queries', () => {

  test.skip('Documentation link icons are visible and clicking on them opens a new tab', async () => {

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('div[role="gridcell"]:has-text("https://learn.microsoft.com/en-us/graph/api/user-get")').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.title()).toBeDefined();
  });
});

test.describe('Settings', () => {

  test('Change theme settings', async () => {

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
  })
})

test.describe('Run query', () => {

  test('user can run query', async () => {
    const runQueryButton = page.locator('.run-query-button button');
    await runQueryButton.click();
    await page.waitForTimeout(100);
    const messageBar = page.locator('.ms-MessageBar-content');
    expect(messageBar).toBeDefined();
  });

});

test.describe('Autocomplete', () => {
  test('Adds message and gets autocomplete options', async () => {

    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();

    await queryInputField.type('/mess');
    await page.locator('label:has-text("messages")').click();
    await queryInputField.type('?sel');
    await page.locator('label:has-text("$select")').click();
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');

    // eslint-disable-next-line max-len
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me/messages?$select=id")').toBeDefined()

  });

})

test.describe('Version v1.0/beta', () => {

  test('Changing the version via the dropdown menu changes the version in the request URL field', async () => {
    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').click();
    await page.locator('button[role="option"]:has-text("beta")').click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/beta/me")').toBeDefined()

    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').click();
    await page.locator('button[role="option"]:has-text("v1.0")').click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me")').toBeDefined()

  });

  test('Changing the version via the request URL field changes the version in the dropdown', async () => {
    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/beta/me');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').toBeDefined();

    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/v1.0/me');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').toBeDefined();

  });
})


