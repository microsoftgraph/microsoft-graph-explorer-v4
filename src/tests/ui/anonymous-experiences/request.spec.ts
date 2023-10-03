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
    await queryInputField.type('?$sel');
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

  test('Tests query parameter addition on autocomplete', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/messages');
    await queryInputField.type('?sel');
    await page.locator('label:has-text("$select")').click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me/messages?$select=id")').toBeDefined()
  })

  test('Tests $filter query parameter for v1 version', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users');
    await queryInputField.type('?fil');
    await page.locator('label:has-text("$filter")').click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');
    await queryInputField.type('startsWith(displayName, \'Megan\')');
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/users?$filter=startsWith(displayName, \'Megan\')")').toBeDefined();
  })

  test('Tests query parameter for beta version that do not require a $ sign', async () => {
    await page.reload();
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/beta/me/messages');
    await queryInputField.type('?select=id,sender');
    const runQueryButton = page.locator('.run-query-button button');
    await runQueryButton.click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/beta/me/messages?select=id,sender")').toBeDefined();
    expect(page.getByText('"Microsoft Viva"')).toBeDefined();
  })

  test('Tests query parameter addition for chained query parameters', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/use');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users?sel');
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users?$select=id&fi');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users?$select=id&$filter=startsWith(displayName, \'Megan\')');
    const queryContent = await page.locator('[aria-label="Query sample input"]').inputValue();
    expect(queryContent).toBe('https://graph.microsoft.com/v1.0/users?$select=id&$filter=startsWith(displayName, \'Megan\')');
  })

  test('Tests query deletion on the query textbox', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/users?$select=id');
    for(let i = 0; i<11; i++){
      await queryInputField.press('Backspace');
    }
    const queryContent = await page.locator('[aria-label="Query sample input"]').inputValue();
    expect(queryContent).toBe('https://graph.microsoft.com/v1.0/me/users');

  })

  test('Tests $count with $filter query parameter', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/tran');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.gr');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?cou');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=t');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true&fi');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true&$filter=startsWith()');
    await queryInputField.press('ArrowLeft');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true&$filter=startsWith(displayName, \'a\')');
    const queryContent = await page.locator('[aria-label="Query sample input"]').inputValue();
    expect(queryContent).toBe('https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true&$filter=startsWith(displayName, \'a\')');
  });

  test('Tests $filter with or operator ', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await queryInputField.fill('https://graph.microsoft.com/v1.0/use');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users?fi');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users?$filter=startsWith(displayName, \'mary\') or startsW');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/users?$filter=startsWith(displayName, \'mary\') or startsWith(givenName, \'mary\') or startsWith(mail, \'mary\') or startsWith(userPrincipalName, \'mary\')');
    const queryContent = await page.locator('[aria-label="Query sample input"]').inputValue();
    expect(queryContent).toBe('https://graph.microsoft.com/v1.0/users?$filter=startsWith(displayName, \'mary\') or startsWith(givenName, \'mary\') or startsWith(mail, \'mary\') or startsWith(userPrincipalName, \'mary\')');
  });

  test('Add query properties after long filter properties ', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await queryInputField.fill('https://graph.microsoft.com/v1.0/groups');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/groups?fil');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/groups?$filter=NOT groupTypes/any(c:c eq \'Unified\')&$');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/groups?$filter=NOT groupTypes/any(c:c eq \'Unified\')&$c');
    await queryInputField.press('Tab');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/groups?$filter=NOT groupTypes/any(c:c eq \'Unified\')&$count=true');
    await queryInputField.press('Enter');
    expect(page.getByText('"Filter operator \'Not\' is not supported."')).toBeDefined();
    const queryContent = await page.locator('[aria-label="Query sample input"]').inputValue();
    expect(queryContent).toBe('https://graph.microsoft.com/v1.0/groups?$filter=NOT groupTypes/any(c:c eq \'Unified\')&$count=true');
  });

  test('Add segment and confirm that the URL is on the input field', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await queryInputField.fill('https://graph.microsoft.com/v1.0/tenantRelationships/microsoft.graph.findTenantInformationByTenantId(tenantId=\'{tenantId}\')');
    const queryContent = await page.locator('[aria-label="Query sample input"]').inputValue();
    expect(queryContent).toBe('https://graph.microsoft.com/v1.0/tenantRelationships/microsoft.graph.findTenantInformationByTenantId(tenantId=\'{tenantId}\')');
  })

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

  test('User can run query using the Enter key and different results are received for different queries', async () => {
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await page.evaluate(() => document.fonts.ready);
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me');
    await queryInputField.press('Enter');
    await page.waitForTimeout(100);
    await page.evaluate(() => document.fonts.ready);
    expect(page.getByText('"Megan Bowen"')).toBeDefined();
    await queryInputField.fill('');
    await queryInputField.fill('https://graph.microsoft.com/v1.0/me/messages?$select=sender');
    await queryInputField.press('Enter');
    await page.waitForTimeout(100);
    await page.evaluate(() => document.fonts.ready);
    expect(page.getByText('"Microsoft Viva"')).toBeDefined();
  })

  test('User can add request bodies that persist when switching between tabs', async () => {
    await page.getByLabel('HTTP request method option').getByText('GET').click();
    await page.getByRole('option', { name: 'POST' }).click();
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await queryInputField.fill('https://graph.microsoft.com/v1.0/applications');
    await page.getByRole('tab', { name: 'Request body' }).click();
    await page.getByRole('tab', { name: 'Request body' }).press('Tab');
    await page.getByRole('textbox', { name: 'Editor content;Press Alt+F1 for Accessibility Options.' }).fill('{\n\n    "$schema": {}}\n}');
    await page.getByRole('tab', { name: 'Request headers' }).click();
    await page.getByRole('tab', { name: 'Request body' }).click();
    expect(page.getByText('"$schema"')).toBeVisible();

    // Make sure that request body is not there when switching between queries
    await page.getByRole('gridcell', { name: 'my profile (beta)' }).click();
    expect(page.getByText('"$schema"')).not.toBeVisible();
  })

  test('should show documentation link for queries with links ', async () => {
    await page.reload();
    await page.locator('[aria-label="my profile"]').click();
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Read documentation' }).click();
    const page2 = await page2Promise;
    expect(page2.url().indexOf('https://learn.microsoft.com/')).toBeGreaterThan(-1);
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
    expect(await page.screenshot({ clip: { x: 300, y: 0, width: 1365, height: 400 } })).toMatchSnapshot();
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
    expect(await page.screenshot()).toMatchSnapshot();
    const DirectoryPermission =  page.locator('div[role="gridcell"]:has-text("Directory.Read.AllDirectory.Read.All")');
    expect(DirectoryPermission).toBeDefined();
  });

  test('should show a message for opening permissions panel when permission requested is not available', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/userssssss');
    await page.locator('[aria-label="Modify permissions"]').click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(100);
    expect(page.getByText('Permissions for the query are missing on this tab. Sign in to use the Select per')).toBeDefined();

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


