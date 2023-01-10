/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe.skip('Run query', () => {

  test('should change version options', async () => {
    await page.locator('[aria-label="HTTP request method option"] >> text=GET').click();
    await page.locator('button[role="option"]:has-text("POST")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=POST').click();
    await page.locator('button[role="option"]:has-text("PUT")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=PUT').click();
    await page.locator('button[role="option"]:has-text("PATCH")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=PATCH').click();
    await page.locator('button[role="option"]:has-text("DELETE")').click();
    expect(page.locator('text=Sign in to use this method')).toBeDefined();
  })

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

  test('user can run query', async () => {
    const runQueryButton = page.locator('.run-query-button button');
    await runQueryButton.click();
    await page.waitForTimeout(100);
    const messageBar = page.locator('.ms-MessageBar-content');
    expect(messageBar).toBeDefined();
  });

  test('should launch the share query dialog when share query button is clicked', async () => {
    await page.locator('[aria-label="Share query"]').click();
    expect(page.locator('div[role="heading"]:has-text("Share Query")')).toBeDefined();
    // eslint-disable-next-line max-len
    expect(page.locator('text=Share this link to let people try your current query in the Graph Explorer')).toBeDefined();
    // eslint-disable-next-line max-len
    expect(page.locator('text=https://developer.microsoft.com/en-us/graph/graph-explorer?request=me&method=GET')).toBeDefined();
    await page.locator('button:has-text("Copy")').click();
    expect(page.locator('button:has-text("Copied")')).toBeDefined();
    await page.locator('button:has-text("Close")').click();
  });

});

test.describe.skip('Request section', () => {
  test('should add request headers', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/users?$count=true');
    await page.locator('[aria-label="Request headers"]').click();
    await page.locator('[placeholder="Key"]').click();
    await page.locator('[placeholder="Key"]').fill('ConsistencyLevel');
    await page.locator('[placeholder="Key"]').press('Tab');
    await page.locator('[placeholder="Value"]').fill('eventual');
    await page.locator('button:has-text("Add")').click();
    await page.locator('button[role="button"]:has-text("Run query")').click();
    expect(page.locator('text=ConsistencyLevel')).toBeDefined();
    expect(page.locator('text=eventual')).toBeDefined();
  });

  test('should edit request headers', async () => {
    await page.locator('[aria-label="Edit request header"]').click();
    await page.locator('[placeholder="Key"]').fill('ConsistencyLev');
    await page.locator('button:has-text("Update")').click();
    const newHeaderKey = page.locator('text=ConsistencyLev');
    expect(newHeaderKey).toBeDefined();
  });

  test('should delete request headers', async () => {
    expect(page.locator('text=ConsistencyLev')).toBeDefined();
    await page.locator('[aria-label="Remove request header"]').click();
  })

  test('should show permissions for /me endpoint', async () => {
    await page.locator('button[role="tab"]:has-text(" Sample queries")').click();
    await page.locator('[aria-label="my profile"]').click();
    // Click [aria-label="Modify permissions"]
    await page.locator('[aria-label="Modify permissions"]').click();
    // Click text=One of the following permissions is required to run the query. Sign in with an a
    const permissionsText = page.locator('text=One of the following permissions is required to run the query. Sign in with an a');
    expect(permissionsText).toBeDefined();
    // Click div[role="gridcell"]:has-text("Directory.Read.AllDirectory.Read.All")
    const DirectoryPermission =  page.locator('div[role="gridcell"]:has-text("Directory.Read.AllDirectory.Read.All")');
    expect(DirectoryPermission).toBeDefined();
  })

  test('should show access token message when not authenticated ', async () => {
    // Click [aria-label="Access token"]
    await page.locator('[aria-label="Access token"]').click();
    // Click text=To view your access token, sign in to Graph Explorer.
    const tokenMessage =  page.locator('text=To view your access token, sign in to Graph Explorer.');
    expect(tokenMessage).toBeDefined();
  })
})


