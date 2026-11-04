/* eslint-disable max-len */
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { useLocalMonacoWorkers } from './monaco-workers';

test.use({
  viewport: {
    height: 914,
    width: 412
  }
});

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({ viewport: { width: 412, height: 914 }, timezoneId: 'UTC' });
  await page.route(url => url.pathname.endsWith('/samples'), route => route.fulfill({
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({ sampleQueries: [{
      id: 'mobile-profile',
      category: 'Getting started',
      requestUrl: '/v1.0/me',
      method: 'GET',
      humanName: 'my profile'
    }] })
  }));
  await page.route('**/openapi/tree?**', route => route.fulfill({
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({
      segment: '/', labels: [], children: [{
        segment: 'applications', children: [],
        labels: ['v1.0', 'beta'].map(name => ({ name, methods: ['GET'] }))
      }]
    })
  }));
  await page.route('**/api/proxy?**', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ displayName: 'Layout Profile', givenName: 'Layout', surname: 'Profile' })
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@*/min/vs/**', route => route.fulfill({
    path: path.join(
      process.cwd(), 'node_modules', 'monaco-editor', 'min', 'vs',
      new URL(route.request().url()).pathname.split('/min/vs/')[1]
    )
  }));
  await useLocalMonacoWorkers(page);
  await page.goto('/');
});

test.afterAll(async () => {
  await page.close();
});


test.describe('Sidebar navigation', () => {
  test('should have sample queries tab', async () => {
    await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Queries', exact: true });
    await drawer.getByRole('tab', { name: 'Sample queries', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    const sample = drawer.getByText('my profile', { exact: true });
    await expect(sample).toBeVisible();
    await drawer.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
    expect(await page.screenshot()).toMatchSnapshot();
    await sample.click();
    await expect(drawer).not.toBeVisible();
    await page.getByRole('button', { name: 'Run query' }).click();
    await expect(page.locator('#response-area .view-lines')).toContainText('Layout Profile');
  })
  test('should have resources tab', async () => {
    await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Queries', exact: true });
    await drawer.getByRole('tab', { name: 'API Explorer', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await drawer.getByText('applications', { exact: true }).click();
    await expect(drawer.getByText('GET', { exact: true })).toBeVisible();
    expect(await page.screenshot()).toMatchSnapshot();
    await drawer.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(drawer).not.toBeVisible();
  })
  test('should have history tab', async () => {
    await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Queries', exact: true });
    await page.evaluate(() => document.fonts.ready);
    await drawer.getByRole('tab', { name: 'History', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await expect(drawer.getByRole('treeitem').first()).toBeVisible();
    expect(await page.screenshot()).toMatchSnapshot();
    await drawer.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(drawer).not.toBeVisible();
  })
});

test.describe('Request area navigation', () => {
  test('should have permissions tab in overflow menu', async () => {
    await page.getByLabel('More request area items').click();
    await page.getByRole('menuitem', { name: 'Modify permissions' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    page.locator('span').filter({ hasText: 'Directory.Read.All' });
    expect(await page.screenshot()).toMatchSnapshot();
  })

  test('should have access token tab in overflow menu', async () => {
    await page.getByLabel('More request area items').click();
    await page.getByRole('menuitem', { name: 'Access token' }).click();
    page.getByText('To view your access token, sign in to Graph Explorer.');
    expect(await page.screenshot()).toMatchSnapshot();
  })
});
test.describe('Response area navigation', () => {
  test('should have code snippets tab in overflow menu', async () => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Code snippets' }).click();
    await page.getByRole('tab', { name: 'C# C#' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    expect(await page.screenshot()).toMatchSnapshot();
  })
  test('should have adaptive card tab in overflow menu', async () => {
    await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Queries', exact: true });
    await drawer.getByRole('tab', { name: 'Sample queries', exact: true }).click();
    await drawer.getByText('my profile', { exact: true }).click();
    await expect(drawer).not.toBeVisible();
    await page.getByRole('button', { name: 'Run query' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Adaptive cards' }).click();
    await page.getByRole('tabpanel', { name: 'Adaptive cards' }).getByRole('tab', { name: 'Card' }).click();
    expect(page.getByText('Megan Bowen')).toBeDefined();
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('tab', { name: 'JSON template' }).click();
    expect(page.getByText('Get started with adaptive cards on Adaptive Cards Templating SDK and experiment ')).toBeDefined();
    await page.waitForTimeout(200);
    expect(await page.screenshot()).toMatchSnapshot();
  })
  test('should have expand component tab in overflow menu', async () => {
    await page.getByLabel('More response area items').click();
    await page.getByRole('menuitem', { name: 'Expand response' }).click();
    await page.getByRole('tab', { name: 'More items' }).click();
    await page.getByRole('menuitem', { name: 'Code snippets' }).click();
    await page.getByRole('tab', { name: 'C# C#' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    expect(await page.screenshot()).toMatchSnapshot();
    await page.getByRole('button', { name: 'Close expanded response area' }).click();
  });
});