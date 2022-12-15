import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe('Sample Queries', () => {

  test('Sign in tooltip should be visible', async () => {
    await page
      .locator('[aria-label="Applications has 8 results 2 of 28"] [aria-label="expand collapse group"]')
      .click();
    await expect(page).toHaveScreenshot('sampleQueriesGroup.png'); //no-commit
    await expect(page
      // eslint-disable-next-line max-len
      .locator('[aria-label="patchupdate application properties"] div[role="gridcell"]:has-text("Sign in to try this sample")'))
      .toBeVisible();
  });

});

test.describe('Settings', () => {

  test('Change theme settings', async () => {

    const settingsButton = page.locator('[aria-label="Settings"]');
    await settingsButton.click();
    await expect(page).toHaveScreenshot('anonymousThemeSetting.png');
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
  });

  test('Get a sandbox with sample data', async () => {
    test.slow();
    await page.locator('[aria-label="Settings"]').click();
    await expect(page).toHaveScreenshot('anonymousSettings.png');
    // Click text=Get a sandbox with sample data
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('text=Get a sandbox with sample data').click()
    ]);
    await expect(page).toHaveScreenshot('anonymousGetASandbox.png');
    expect(page1.url()).toBe('https://developer.microsoft.com/en-US/microsoft-365/dev-program');
  })
})

test.describe('Run query', () => {

  test('user can run query', async () => {
    const runQueryButton = page.locator('.run-query-button button');
    await runQueryButton.click();
    await expect(page).toHaveScreenshot('anonymousRunQuery.png');
    await page.waitForTimeout(100);
    const messageBar = page.locator('.ms-MessageBar-content');
    expect(messageBar).toBeDefined();
  });

});

test.describe('Autocomplete', () => {
  test('Adds message and gets autocomplete options', async () => {

    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    await expect(page).toHaveScreenshot('anonymousSampleInput.png');

    await queryInputField.type('/mess');
    await page.locator('label:has-text("messages")').click();
    await queryInputField.type('?sel');
    await page.locator('label:has-text("$select")').click();
    await expect(page).toHaveScreenshot('anonymousAutocomplete.png');
    await queryInputField.press('Tab');
    await queryInputField.press('Tab');

    // eslint-disable-next-line max-len
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me/messages?$select=id")').toBeDefined()
    await expect(page).toHaveScreenshot('anonymousCompleteQuery.png');

  });

})

test.describe('Version v1.0/beta', () => {

  test('Changing the version via the dropdown menu changes the version in the request URL field', async () => {
    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').click();
    await expect(page).toHaveScreenshot('anonymousV1Version.png');
    await page.locator('button[role="option"]:has-text("beta")').click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/beta/me")').toBeDefined()

    await page.locator('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').click();
    await expect(page).toHaveScreenshot('anonymousBetaVersion.png');
    await page.locator('button[role="option"]:has-text("v1.0")').click();
    expect('input[aria-label="Query sample input"]:has-text("https://graph.microsoft.com/v1.0/me")').toBeDefined()
    await expect(page).toHaveScreenshot('anonymousCompleteVersion.png');

  });

  test('Changing the version via the request URL field changes the version in the dropdown', async () => {
    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/beta/me');
    await expect(page).toHaveScreenshot('anonymousChangeVersionInUrlBeta.png');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("beta")').toBeDefined();

    await page.locator('[aria-label="Query sample input"]').fill('https://graph.microsoft.com/v1.0/me');
    await expect(page).toHaveScreenshot('anonymousChangeVersionInUrlV1.png');
    expect('[aria-label="Microsoft Graph API Version option"] span:has-text("v1.0")').toBeDefined();

  });
})

test.describe('HTTP Methods', () => {
  test('should change without crashing', async () => {
    await page.locator('[aria-label="HTTP request method option"] >> text=GET').click();
    await expect(page).toHaveScreenshot('anonymousGET.png');
    await page.locator('button[role="option"]:has-text("POST")').click();
    await page.locator('[aria-label="HTTP request method option"] >> text=POST').click();
    await expect(page).toHaveScreenshot('anonymousPOST.png');
    await page.locator('button[role="option"]:has-text("PUT")').click();
    await expect(page).toHaveScreenshot('anonymousPUT.png');
    await page.locator('[aria-label="HTTP request method option"] >> text=PUT').click();
    await page.locator('button[role="option"]:has-text("PATCH")').click();
    await expect(page).toHaveScreenshot('anonymousPATCH.png');
    await page.locator('[aria-label="HTTP request method option"] >> text=PATCH').click();
    await page.locator('button[role="option"]:has-text("DELETE")').click();
    await expect(page).toHaveScreenshot('anonymousDELETE.png');
    expect(page.locator('text=Sign in to use this method')).toBeDefined();
  })
});

test.describe('Share query', () => {
  test('should launch the share query dialog when share query button is clicked', async () => {
    await page.locator('[aria-label="Share query"]').click();
    await expect(page).toHaveScreenshot('anonymousShareQuery.png');
    expect(page.locator('div[role="heading"]:has-text("Share Query")')).toBeDefined();
    // eslint-disable-next-line max-len
    expect(page.locator('text=Share this link to let people try your current query in the Graph Explorer')).toBeDefined();
    // eslint-disable-next-line max-len
    expect(page.locator('text=https://developer.microsoft.com/en-us/graph/graph-explorer?request=me&method=GET')).toBeDefined();
    await page.locator('button:has-text("Copy")').click();
    await expect(page).toHaveScreenshot('anonymousCopyQuery.png');
    expect(page.locator('button:has-text("Copied")')).toBeDefined();
    await page.locator('button:has-text("Close")').click();
    await expect(page).toHaveScreenshot('anonymousCloseShareQueryDialog.png');
  });
})

test.describe('Resources explorer', () => {
  test('should open the resources explorer when the resources explorer button is clicked', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await expect(page).toHaveScreenshot('anonymousResources.png');
    await page.locator('text=admin (3)').click();
    await page.locator('text=admin').nth(1).click();
    await expect(page).toHaveScreenshot('anonymousResourceItemClick.png');
    const queryInputField = page.locator('[aria-label="Query sample input"]');
    await queryInputField.click();
    const queryInputValue = await queryInputField.inputValue();
    expect(queryInputValue).toBe('https://graph.microsoft.com/v1.0/admin');
    await expect(page).toHaveScreenshot('anonymousResourceInUrl.png');
  });

  test('should isolate a resource when the isolate button is clicked', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('text=admin (3)More actions >> [aria-label="More actions"]').click();
    await expect(page).toHaveScreenshot('anonymousResourcesMoreActions.png');
    await page.locator('button[role="menuitem"]:has-text("Isolate")').click();
    await expect(page).toHaveScreenshot('anonymousResourcesIsolate.png');
    await page.locator('button:has-text("Close isolation")').click();
    await expect(page).toHaveScreenshot('anonymousResourcesCloseIsolation.png');
  });

  test('should add a resource to collection', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('text=admin (3)').click();
    await page.locator('text=GETadminMore actions >> [aria-label="More actions"]').click();
    await page.locator('button[role="menuitem"]:has-text("Add to collection")').click();
    await expect(page).toHaveScreenshot('anonymousResourceAddToCollection.png');
    await page.locator('[aria-label="Preview collection"]').click();
    await expect(page).toHaveScreenshot('anonymousResourcePreviewCollection.png');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("Download Postman collection")').click()
    ]);
    expect(download.suggestedFilename().indexOf('postman_collection.json')).toBeGreaterThan(-1);
    await page.locator('[aria-label="select row"]').click();
    await expect(page).toHaveScreenshot('anonymousResourcesSelectCollections.png');
    await page.locator('button[role="menuitem"]:has-text("Remove")').click();
  });

  test('should switch between v1 and beta versions of resources', async () => {
    await page.locator('button[role="tab"]:has-text("Resources")').click();
    await page.locator('button[role="switch"]').click();
    await expect(page).toHaveScreenshot('anonymousResourcesSwitchVersion.png');
    expect(page.locator('label:has-text("On")')).toBeDefined();
  })
});

test.describe('History tab', () => {
  test('should show added history items to Today\'s collection ', async () => {
    await page.locator('button[role="button"]:has-text("Run query")').click();
    await page.locator('text= Sample queries Resources History >> [aria-label="More items"]').click();
    await expect(page).toHaveScreenshot('anonymousHistoryMoreItems.png');
    await page.locator('button[role="menuitem"]:has-text("History")').click();
    await expect(page).toHaveScreenshot('anonymousHistoryTab.png');
    expect(page.locator('span:has-text("Today")')).toBeDefined();
  });
});

test.describe('Request section', () => {

  test('should add request headers', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/users?$count=true');
    await page.locator('[aria-label="Request headers"]').click();
    await expect(page).toHaveScreenshot('anonymousRequestHeaders.png');
    await page.locator('[placeholder="Key"]').click();
    await page.locator('[placeholder="Key"]').fill('ConsistencyLevel');
    await expect(page).toHaveScreenshot('anonymousRequestHeadersKey.png');
    await page.locator('[placeholder="Key"]').press('Tab');
    await page.locator('[placeholder="Value"]').fill('eventual');
    await expect(page).toHaveScreenshot('anonymousRequestHeadersValue.png');
    await page.locator('button:has-text("Add")').click();
    await expect(page).toHaveScreenshot('anonymousRequestHeadersAdd.png');
    await page.locator('button[role="button"]:has-text("Run query")').click();
    expect(page.locator('text=ConsistencyLevel')).toBeDefined();
    expect(page.locator('text=eventual')).toBeDefined();
  });

  test('should edit request headers', async () => {
    await page.locator('[aria-label="Edit request header"]').click();
    await page.locator('[placeholder="Key"]').fill('ConsistencyLev');
    await expect(page).toHaveScreenshot('anonymousRequestHeadersEditKey');
    await page.locator('button:has-text("Update")').click();
    await expect(page).toHaveScreenshot('anonymousRequestHeadersEditUpdate.png');
    const newHeaderKey = page.locator('text=ConsistencyLev');
    await expect(page).toHaveScreenshot('anonymousREquestHeadersEditNewKey.png');
    expect(newHeaderKey).toBeDefined();
  });

  test('should delete request headers', async () => {
    expect(page.locator('text=ConsistencyLev')).toBeDefined();
    await expect(page).toHaveScreenshot('anonymousRequestHeadersDelete.png');
    await page.locator('[aria-label="Remove request header"]').click();
    await expect(page).toHaveScreenshot('anonymousRequestHeadersDeleteConfirm.png');
  })

  test('should add request body to non-GET requests', async () => {
    await page.locator('[aria-label="Request body"]').click();
    await expect(page).toHaveScreenshot('anonymousRequestBody.png');
    await page.locator('button[role="tab"]:has-text("Sample queries")').click();
    // eslint-disable-next-line max-len
    await page.locator('[aria-label="Applications has 8 results 2 of 28"] [aria-label="expand collapse group"]').click();
    await page.locator('[aria-label="update application properties"]').dblclick();
    await expect(page).toHaveScreenshot('anonymousRequestBodySampleQuery.png');
    expect(page.locator('text=/.*"signInAudience".*/')).toBeDefined();
  });

  test.describe('Snippets', () => {
    test('should show snippets for the selected language', async () => {
      const queryInput = page.locator('[aria-label="Query sample input"]');
      await queryInput.click();
      queryInput.fill('https://graph.microsoft.com/v1.0/me/messages');
      await queryInput.press('Tab');
      await expect(page).toHaveScreenshot('anonymousSnippets.png');
      const snippetTab = page.locator('[aria-label="Code snippets"]');
      await snippetTab.click();
      await expect(page).toHaveScreenshot('anonymousSnippetsTab.png');
      const cSharpTab = page.locator('button[role="tab"]:has-text("CSharp")');
      await cSharpTab.click();
      await expect(page).toHaveScreenshot('anonymousSnippetsCSharp.png');
      await page.locator('button[role="tab"]:has-text("JavaScript")').click();
      await page.locator('button[name="Java"]').click();
      await expect(page).toHaveScreenshot('anonymousSnippetsJava.png');
      await page.locator('button[role="tab"]:has-text("Go")').click();
      await expect(page).toHaveScreenshot('anonymousSnippetsGo.png');
      await page.locator('button[role="tab"]:has-text("PowerShell")').click();
      await expect(page).toHaveScreenshot('anonymousSnippetsPowerShell.png');
    });
  })

  test.describe('Toolkit component', () => {
    test('should show toolkit component for a valid url', async () => {
      const queryInput = page.locator('[aria-label="Query sample input"]');
      await queryInput.click();
      await queryInput.fill('https://graph.microsoft.com/me');
      const toolkitTab = page.locator('[aria-label="Toolkit component"]');
      await toolkitTab.click();
      await expect(page).toHaveScreenshot('anonymousToolkitComponent.png');
      expect(page.locator('text=Open this example in')).toBeDefined();
    });

    test('should show an error message for an invalid url', async () => {
      const queryInput = page.locator('[aria-label="Query sample input"]');
      await queryInput.click();
      await queryInput.fill('https://graph.microsoft.com/me/messages');
      const toolkitTab = page.locator('[aria-label="Toolkit component"]');
      await toolkitTab.click();
      await expect(page).toHaveScreenshot('anonymousToolkitComponentError.png');
      expect(page.locator('text=No toolkit component is available')).toBeDefined();
    })
  })

})


