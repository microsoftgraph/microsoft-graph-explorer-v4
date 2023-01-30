/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe('Run query', () => {

  test('should change version options', async () => {
    await page.locator('[aria-label="HTTP request method option"] >> text=GET').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('button[role="option"]:has-text("POST")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=POST').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('button[role="option"]:has-text("PUT")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=PUT').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('button[role="option"]:has-text("PATCH")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=PATCH').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('button[role="option"]:has-text("DELETE")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect(page.locator('text=Sign in to use this method')).toBeDefined();
  })

  test('Changing the version via the dropdown menu changes the version in the request URL field', async () => {
    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('button[role="option"]:has-text("beta")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/beta/me")').toBeDefined()

    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await page.locator('button[role="option"]:has-text("v1.0")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me")').toBeDefined()

  });

  test('Changing the version via the request URL field changes the version in the dropdown', async () => {
    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/beta/me');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').toBeDefined();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();

    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/v1.0/me');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').toBeDefined();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();

  });

  test('Adds message and gets autocomplete options', async () => {

    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();

    await queryInputField.type('/mess');
    await page.locator('label:has-text("messages")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await queryInputField.type('?sel');
    await page.locator('label:has-text("$select")').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 1080 } })).toMatchSnapshot();

    // eslint-disable-next-line max-len
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me/messages?$select=id")').toBeDefined()
  });

  test('user can run query', async () => {
    const profileSample = page.locator('[aria-label="my profile"]');
    await profileSample.click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    const runQueryButton = page.locator('.run-query-button button');
    expect(await page.screenshot()).toMatchSnapshot();
    await runQueryButton.click();
    await page.waitForTimeout(100);
    await page.evaluate(() => document.fonts.ready);
    const messageBar = page.locator('.ms-MessageBar-content');
    expect(await page.screenshot()).toMatchSnapshot();
    expect(messageBar).toBeDefined();
  });

  test('should show documentation link for queries with links ', async () => {
    await page.locator('[aria-label="my profile"]').click();
    await page.locator('[aria-label="More Info"]').click();
    const [page3] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('button:has-text("Learn more")').click()
    ]);
    expect(page3.url().indexOf('https://learn.microsoft.com/')).toBeGreaterThan(-1);
  })

  test('should launch the share query dialog when share query button is clicked', async () => {
    await page.locator('[aria-label="Share query"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(page.locator('div[role="heading"]:has-text("Share Query")')).toBeDefined();
    // eslint-disable-next-line max-len
    expect(page.locator('text=Share this link to let people try your current query in the Graph Explorer')).toBeDefined();
    // eslint-disable-next-line max-len
    expect(page.locator('text=https://developer.microsoft.com/en-us/graph/graph-explorer?request=me&method=GET')).toBeDefined();
    await page.locator('button:has-text("Copy")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
    expect(page.locator('button:has-text("Copied")')).toBeDefined();
    await page.locator('button:has-text("Close")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
  });

});

test.describe.serial('Request section', () => {
  test('should add request headers', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/users?$count=true');
    await page.locator('[aria-label="Request headers"]').click();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
    await page.locator('[placeholder="Key"]').click();
    await page.locator('[placeholder="Key"]').fill('ConsistencyLevel');
    await page.locator('[placeholder="Key"]').press('Tab');
    await page.locator('[placeholder="Value"]').fill('eventual');
    await page.locator('button:has-text("Add")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
    await page.locator('button[role="button"]:has-text("Run query")').click();
    expect(page.locator('text=ConsistencyLevel')).toBeDefined();
    expect(page.locator('text=eventual')).toBeDefined();
  });

  test('should edit request headers', async () => {
    await page.locator('[aria-label="Edit request header"]').click();
    await page.locator('[placeholder="Key"]').fill('ConsistencyLev');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
    await page.locator('button:has-text("Update")').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
    const newHeaderKey = page.locator('text=ConsistencyLev');
    expect(newHeaderKey).toBeDefined();
  });
})

test.describe('Permissions', () => {
  test('should show permissions for /me endpoint', async () => {
    await page.locator('button[role="tab"]:has-text(" Sample queries")').click();
    await page.locator('[aria-label="my profile"]').click();
    await page.locator('[aria-label="Modify permissions"]').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await page.evaluate(() => document.fonts.ready);
    const permissionsText = page.locator('text=One of the following permissions is required to run the query. Sign in with an a');
    expect(permissionsText).toBeDefined();
    expect(await page.screenshot({ clip: { x: 0, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
    const DirectoryPermission =  page.locator('div[role="gridcell"]:has-text("Directory.Read.AllDirectory.Read.All")');
    expect(DirectoryPermission).toBeDefined();
  })
})

test.describe('Access token tab', () => {
  test('should show access token message when not authenticated ', async () => {
    await page.locator('[aria-label="Access token"]').click();
    await page.evaluate(() => document.fonts.ready);
    const tokenMessage =  page.locator('text=To view your access token, sign in to Graph Explorer.');
    expect(tokenMessage).toBeDefined();
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1920, height: 400 } })).toMatchSnapshot();
  })
})


