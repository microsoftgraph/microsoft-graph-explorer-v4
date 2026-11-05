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
  await page.route(url => url.pathname.endsWith('/permissions'), route => route.fulfill({
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify([{
      value: 'User.Read',
      consentDescription: 'Allows users to sign in to the app and read their profile.',
      isAdmin: false,
      consented: false,
      isLeastPrivilege: true
    }])
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

// Response tabs in the overflow menu and the expanded response dialog are covered by layout-scrolling.spec.ts.
test.describe('Request area navigation', () => {
  // At this width only the selected request tab fits, so the other tabs are listed in the "more tabs" menu.
  async function selectRequestTabFromOverflowMenu(name: string) {
    const request = page.locator('#request-area');
    await request.getByRole('tab', { name: /more tabs/ }).click();
    await page.getByRole('menuitem', { name, exact: true }).click();
    await expect(request.getByRole('tab', { name, exact: true })).toHaveAttribute('aria-selected', 'true');
    return request;
  }

  test('should have permissions tab in overflow menu', async () => {
    const request = await selectRequestTabFromOverflowMenu('Modify Permissions');
    await expect(request.getByRole('table', { name: 'Permissions Table' })).toBeVisible();
    await expect(request.getByText('User.Read', { exact: true })).toBeVisible();
  });

  test('should have access token tab in overflow menu', async () => {
    const request = await selectRequestTabFromOverflowMenu('Access token');
    await expect(request.getByText('To view your access token, sign in to Graph Explorer.', { exact: true }))
      .toBeVisible();
  });
});