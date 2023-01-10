/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

test.describe.skip('Response section', () => {
  test('should show a response for a successful request', async () => {
    await page.locator('button[role="button"]:has-text("Run query")').click();
    const response = page.locator('text=/.*"displayName".*/');
    expect(response).toBeDefined();
  })

  test.skip('should show response headers for a successful request', async () => {
    await page.locator('[aria-label="my profile"]').click();
    // Click button[role="button"]:has-text("Run query")
    await page.locator('button[role="button"]:has-text("Run query")').click();
    // Click [aria-label="Response headers"]
    await page.locator('[aria-label="Response headers"]').click();
    // Click text=/.*"access-control-allow-origin".*/
    const responseSample =  page.locator('text=/.*"access-control-allow-origin".*/');
    expect(responseSample).toBeDefined();
  })

  test('should show snippets for the selected language', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/me/messages');
    await queryInput.press('Tab');
    const snippetTab = page.locator('[aria-label="Code snippets"]');
    await snippetTab.click();
    const cSharpTab = page.locator('button[role="tab"]:has-text("CSharp")');
    await cSharpTab.click();
    await page.locator('button[role="tab"]:has-text("JavaScript")').click();
    await page.locator('button[name="Java"]').click();
    await page.locator('button[role="tab"]:has-text("Go")').click();
    await page.locator('button[role="tab"]:has-text("PowerShell")').click();
  });

  test('should show toolkit component for a valid url', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    await queryInput.fill('https://graph.microsoft.com/me');
    const toolkitTab = page.locator('[aria-label="Toolkit component"]');
    await toolkitTab.click();
    expect(page.locator('text=Open this example in')).toBeDefined();
  });

  test('should show an error message for an invalid url', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    await queryInput.fill('https://graph.microsoft.com/me/messages');
    const toolkitTab = page.locator('[aria-label="Toolkit component"]');
    await toolkitTab.click();
    expect(page.locator('text=No toolkit component is available')).toBeDefined();
  })

  test('should show a valid adaptive card for a successful request', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]')
    await queryInput.click();
    await queryInput.fill('https://graph.microsoft.com/v1.0/me');
    await page.locator('button[role="button"]:has-text("Run query")').click();
    await page.locator('[aria-label="Adaptive cards"]').click();
    const response = page.locator('text=Megan Bowen')
    expect(response).toBeDefined();
    const jsonResponseTab =  page.locator('[aria-label="JSON template"]');
    await jsonResponseTab.click();
    // Click text=Get started with adaptive cards on Adaptive Cards Templating SDK and experiment
    // eslint-disable-next-line max-len
    const jsonResponseSample = page.locator('text=Get started with adaptive cards on Adaptive Cards Templating SDK and experiment ');
    expect(jsonResponseSample).toBeDefined();
  })

  test('should open an expanded modal with response tabs when Expand is clicked', async () => {
    await page.locator('[aria-label="Expand response"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Response headers"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Code snippets"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Toolkit component"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Adaptive cards"]').click();
    await page.locator('[aria-label="Close expanded response area"]').click();
  })
})