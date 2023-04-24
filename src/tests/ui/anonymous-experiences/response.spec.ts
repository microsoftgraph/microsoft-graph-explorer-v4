/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/');
});

const waitForFonts = async (): Promise<void> => {
  await page.waitForTimeout(200);
  await page.evaluate(() => document.fonts.ready);
};

test.describe('Response section', () => {
  test('should show a response for a successful request', async () => {
    await page.locator('button[role="button"]:has-text("Run query")').click();
    const response = page.locator('text=/.*"displayName".*/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: -200, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect(response).toBeDefined();
  })

  test('should show snippets for the selected language', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    queryInput.fill('https://graph.microsoft.com/v1.0/me/messages');
    await queryInput.press('Tab');
    const snippetTab = page.locator('[aria-label="Code snippets"]');
    await snippetTab.click();
    await waitForFonts();
    expect(page.getByText('graphClient.Me.Messages.GetAsync();')).toBeDefined();
    await page.getByRole('tab', { name: 'Go Go' }).click();
    await waitForFonts();
    expect(page.getByText('result, err := graphClient.Me().Messages().Get(con')).toBeDefined();
    await page.getByRole('tab', { name: 'Java Java' }).click();
    await waitForFonts();
    expect(page.getByText('MessageCollectionPage messages = graphClient.me().')).toBeDefined();
    await page.getByRole('tab', { name: 'JavaScript JavaScript' }).click();
    await waitForFonts();
    expect(page.getByText('\'/me/messages\'')).toBeDefined();
    await page.getByRole('tab', { name: 'PowerShell PowerShell' }).click();
    await waitForFonts();
    expect(page.getByText('Get-MgUserMessage -UserId')).toBeDefined();
  });

  test('should show toolkit component for a valid url', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    await queryInput.fill('https://graph.microsoft.com/v1.0/me');
    await page.waitForTimeout(200);
    expect(await page.screenshot({ clip: { x: 300, y: -200, width: 1920, height: 1080 } })).toMatchSnapshot();
    const toolkitTab = page.locator('[aria-label="Toolkit component"]');
    await toolkitTab.click();
    await waitForFonts();
    expect(await page.screenshot({ clip: { x: 300, y: -200, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect(page.locator('text=Open this example in')).toBeDefined();
  });

  test('should show an error message for an invalid url', async () => {
    const queryInput = page.locator('[aria-label="Query sample input"]');
    await queryInput.click();
    await queryInput.fill('https://graph.microsoft.com/v1.0/me/messages');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.screenshot({ clip: { x: 300, y: -200, width: 1920, height: 1080 } })).toMatchSnapshot();
    const toolkitTab = page.locator('[aria-label="Toolkit component"]');
    await toolkitTab.click();
    await waitForFonts();
    expect(await page.screenshot({ clip: { x: 300, y: -200, width: 1920, height: 1080 } })).toMatchSnapshot();
    expect(page.locator('text=No toolkit component is available')).toBeDefined();
  })

  test('should open an expanded modal with response tabs when Expand is clicked', async () => {
    await page.locator('[aria-label="Expand response"]').click();
    await waitForFonts();
    expect(await page.screenshot()).toMatchSnapshot();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Response headers"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Code snippets"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Toolkit component"]').click();
    await page.locator('text= Response preview Response headers Code snippets Toolkit component Adaptiv >> [aria-label="Adaptive cards"]').click();
    await page.locator('[aria-label="Close expanded response area"]').click();
    await waitForFonts();
    expect(await page.screenshot()).toMatchSnapshot();
  })
})