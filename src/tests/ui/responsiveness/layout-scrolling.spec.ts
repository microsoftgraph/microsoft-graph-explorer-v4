import { expect, Locator, Page, test } from '@playwright/test';
import path from 'path';
import { useLocalMonacoWorkers } from './monaco-workers';

const responseMarker = 'RESPONSE_END';
const snippetMarker = 'SNIPPET_END';
const headerMarker = 'HEADER_END';
const responseBody = {
  displayName: 'Layout Profile',
  givenName: 'Layout',
  surname: 'Profile',
  mail: 'layout@example.com',
  ...Object.fromEntries(Array.from({ length: 80 }, (_, index) => [`line${index}`, `Response line ${index}`])),
  zzLastLine: responseMarker
};
const snippet = [
  ...Array.from({ length: 80 }, (_, index) => `// Snippet line ${index}`),
  `// ${snippetMarker}`
].join('\n');
const sidebarSamples = Array.from({ length: 30 }, (_, index) => ({
  id: `layout-sidebar-${index}`,
  category: 'Layout samples',
  requestUrl: index === 0 ? '/v1.0/me' : `/v1.0/users?$top=${index + 1}`,
  method: 'GET',
  humanName: index === 0 ? 'my profile' : `Layout sample ${index}`
}));
const sidebarResources = {
  segment: '/',
  labels: [],
  children: Array.from({ length: 30 }, (_, index) => ({
    segment: `layoutResource${index.toString().padStart(2, '0')}`,
    labels: ['v1.0', 'beta'].map(name => ({ name, methods: ['GET'] })),
    children: []
  }))
};

test.beforeEach(async ({ page }) => {
  await page.route(url => url.pathname.endsWith('/samples'), route => route.fulfill({
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({ sampleQueries: sidebarSamples })
  }));
  await page.route('**/openapi/tree?**', route => route.fulfill({
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(sidebarResources)
  }));
  await page.route('**/api/proxy?**', route => route.fulfill({
    status: 200,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-expose-headers': '*',
      ...Object.fromEntries(Array.from({ length: 40 }, (_, index) => [`x-layout-${index}`, `Header ${index}`])),
      'zz-layout-last-header': headerMarker
    },
    body: JSON.stringify(responseBody)
  }));
  await page.route('**/api/graphexplorersnippets**', route => route.fulfill({
    contentType: 'text/plain',
    body: snippet
  }));
  await page.route('https://cdn.jsdelivr.net/npm/monaco-editor@*/min/vs/**', route => {
    const asset = new URL(route.request().url()).pathname.split('/min/vs/')[1];
    return route.fulfill({ path: path.join(process.cwd(), 'node_modules', 'monaco-editor', 'min', 'vs', asset) });
  });
  await useLocalMonacoWorkers(page);
});

async function openExplorer(page: Page, url = '/') {
  await page.goto(url);
  await expect(page.locator('#main-content')).toBeVisible();
  await page.getByRole('button', { name: 'Run query', exact: true }).click();
  await expect(page.locator('#response-area .view-lines')).toContainText('Layout');
}

async function expectContained(inner: Locator, outer: Locator) {
  const [innerBox, outerBox] = await Promise.all([inner.boundingBox(), outer.boundingBox()]);
  expect(innerBox).not.toBeNull();
  expect(outerBox).not.toBeNull();
  if (!innerBox || !outerBox) {
    throw new Error('Expected both layout elements to have bounding boxes');
  }
  expect(innerBox.height).toBeGreaterThan(0);
  expect(innerBox.y).toBeGreaterThanOrEqual(outerBox.y - 1);
  expect(innerBox.y + innerBox.height).toBeLessThanOrEqual(outerBox.y + outerBox.height + 1);
}

async function expectLastLine(scope: Locator, marker: string) {
  const editor = scope.locator('.monaco-editor').first();
  await expect(editor).toBeVisible();
  // Editors keep a minimum height, so on short windows the content around them scrolls to bring them into view.
  await editor.scrollIntoViewIfNeeded();
  await editor.locator('textarea').press('Control+End');
  const lastLine = editor.locator('.view-line').filter({ hasText: marker });
  await expect(lastLine).toBeVisible();
  if (await lastLine.evaluate(element => !element.nextElementSibling)) {
    await editor.locator('textarea').press('Control+ArrowDown');
  }
  const text = lastLine.locator('span').first();
  await expect(text).toBeInViewport({ ratio: 1 });
  await expectContained(text, editor);
  await expectContained(editor, scope);
}

async function selectResponseTab(page: Page, scope: Locator, name: string) {
  const namePattern = new RegExp(`^${name}$`, 'i');
  const tab = scope.getByRole('tab', { name: namePattern });
  if (await tab.isVisible()) {
    await tab.click();
  } else {
    await scope.getByRole('tab', { name: /more tabs/ }).click();
    await page.getByRole('menuitem', { name: namePattern }).click();
  }
}

async function openNavigation(page: Page) {
  await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Queries', exact: true });
  await expect(drawer).toBeVisible();
  await drawer.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
  await expect(drawer.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  return drawer;
}

const sidebarTabs = [
  ['Sample queries', 'Layout sample 29'],
  ['API Explorer', 'layoutResource29'],
  ['History', '/v1.0/users?$top=30']
] as const;

async function expectFillsViewport(page: Page, element: Locator) {
  const [box, viewport] = [await element.boundingBox(), page.viewportSize()];
  if (!box || !viewport) {
    throw new Error('Expected element and viewport bounds');
  }
  expect(Math.abs(box.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.width - viewport.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.height - viewport.height)).toBeLessThanOrEqual(1);
}

async function selectSidebarTab(scope: Locator, tab: string) {
  await scope.getByRole('tab', { name: tab, exact: true }).click();
  if (tab === 'History') {
    await scope.getByRole('treeitem').first().click();
  }
}

// Playwright's role selectors ignore `inert`, so read Chromium's accessibility tree to see what assistive
// technology receives.
async function isExposedToAssistiveTechnology(page: Page, name: string) {
  const session = await page.context().newCDPSession(page);
  const { nodes } = await session.send('Accessibility.getFullAXTree');
  await session.detach();
  return nodes.some(node => !node.ignored && node.name?.value === name);
}

// The selected tab and the search box must not move while the results below them scroll. On windows at least
// 600px tall, the result count above the list must not move either.
async function expectPinnedWhileResultsScroll(scope: Locator, tab: string, marker: string, pinControls: boolean) {
  const pinned = [
    scope.getByRole('tab', { name: tab, exact: true }),
    scope.getByRole('searchbox'),
    ...(pinControls ? [scope.getByText(/search results available/).first()] : [])
  ];
  const before = await Promise.all(pinned.map(locator => locator.boundingBox()));
  const last = scope.getByText(marker, { exact: true });
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport({ ratio: 1 });
  for (const [index, locator] of pinned.entries()) {
    await expect(locator).toBeInViewport({ ratio: 1 });
    const [start, end] = [before[index], await locator.boundingBox()];
    if (!start || !end) {
      throw new Error('Expected pinned element bounds');
    }
    expect(Math.abs(end.y - start.y)).toBeLessThanOrEqual(1);
  }
  await expect.poll(() => last.evaluate(element => {
    let parent = element.parentElement;
    while (parent && !['auto', 'scroll'].includes(getComputedStyle(parent).overflowY)) {
      parent = parent.parentElement;
    }
    return parent?.scrollTop ?? 0;
  })).toBeGreaterThan(0);
}

async function seedHistory(page: Page) {
  await page.evaluate(async body => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('GE_V4');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('history', 'readwrite');
        const store = transaction.objectStore('history');
        store.clear();
        for (let index = 0; index < 30; index++) {
          const createdAt = new Date(Date.now() - index * 1000).toISOString();
          store.put({
            createdAt,
            url: `https://graph.microsoft.com/v1.0/users?$top=${index + 1}`,
            method: 'GET',
            status: 200,
            statusText: 'OK',
            duration: 10,
            result: body,
            headers: [],
            responseHeaders: { 'content-type': 'application/json' }
          }, createdAt);
        }
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally {
      database.close();
    }
  }, responseBody);
  await page.reload();
  await expect(page.locator('#main-content')).toBeVisible();
}

for (const viewport of [
  { width: 320, height: 768 },
  { width: 683, height: 384 },
  { width: 960, height: 540 },
  { width: 1365, height: 768 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 600 },
  { width: 3840, height: 1080 }
]) {
  test(`keeps content reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openExplorer(page);

    const workspace = page.locator('#main-content');
    const response = page.locator('#response-area');
    const sizes = await page.evaluate(() => ({
      width: innerWidth,
      height: innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      responseHeight: document.getElementById('response-area')!.getBoundingClientRect().height,
      requestHeight: document.getElementById('request-area')!.getBoundingClientRect().height
    }));
    expect(sizes.documentWidth).toBe(sizes.width);
    expect(sizes.documentHeight).toBe(sizes.height);
    expect(sizes.responseHeight).toBeGreaterThanOrEqual(240);
    expect(sizes.requestHeight).toBeGreaterThanOrEqual(150);

    await response.scrollIntoViewIfNeeded();
    await expect(response).toBeInViewport({ ratio: 1 });
    await expectLastLine(response, responseMarker);
    await expectContained(response, workspace);
    await expectContained(page.locator('#request-area .monaco-editor'), page.locator('#request-area'));

    if (viewport.height <= 600 || viewport.width === 320) {
      await expect.poll(() => workspace.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    } else if (viewport.height === 1080) {
      expect(await workspace.evaluate(element => element.scrollHeight - element.clientHeight)).toBeLessThanOrEqual(1);
    }
  });
}

for (const viewport of [{ width: 683, height: 384 }, { width: 320, height: 768 }]) {
  test(`keeps all response tabs reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openExplorer(page);
    const response = page.locator('#response-area');
    await response.scrollIntoViewIfNeeded();

    await selectResponseTab(page, response, 'Response headers');
    await expectLastLine(response, headerMarker);
    await selectResponseTab(page, response, 'Code snippets');
    await expectLastLine(response, snippetMarker);

    await selectResponseTab(page, response, 'Adaptive cards');
    await expect(response.locator('#card-tab')).toBeVisible();
    await response.getByRole('tab', { name: /JSON template/i }).click();
    const cardEditor = response.locator('.monaco-editor');
    await cardEditor.scrollIntoViewIfNeeded();
    await cardEditor.locator('textarea').press('Control+End');
    await response.locator('#adaptive-cards-tab').locator('..').evaluate(element => {
      element.scrollTop = element.scrollHeight;
    });
    await expect(cardEditor.locator('.view-line').last()).toBeInViewport();
  });
}

test('keeps the expanded response dialog bounded and its close button reachable', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  const response = page.locator('#response-area');
  await response.scrollIntoViewIfNeeded();
  const expand = response.getByRole('button', { name: 'Expand', exact: true });
  await expand.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeInViewport({ ratio: 1 });
  await expectLastLine(dialog, responseMarker);
  await selectResponseTab(page, dialog, 'Code snippets');
  await expectLastLine(dialog, snippetMarker);
  const close = dialog.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toBeInViewport({ ratio: 1 });
  await close.click();
  await expect(dialog).not.toBeVisible();
  await expect(expand).toBeFocused();
});

test('preserves query, selected tab and request height through compact and desktop resizing', async ({ page }) => {
  await page.setViewportSize({ width: 1365, height: 900 });
  await openExplorer(page);
  const request = page.locator('#request-area');
  const handle = request.locator('[style*="row-resize"]');
  const handleBox = await handle.boundingBox();
  if (!handleBox) {
    throw new Error('Expected the request resize handle to be visible');
  }
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + 80);
  await page.mouse.up();
  const selectedHeight = await page.evaluate(() =>
    document.documentElement.style.getPropertyValue('--request-area-height'));
  expect(parseFloat(selectedHeight)).toBeGreaterThan(300);

  await selectResponseTab(page, page.locator('#response-area'), 'Response headers');
  for (const viewport of [{ width: 683, height: 384 }, { width: 1365, height: 900 }]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('[aria-label="Query sample input"]')).toHaveValue('https://graph.microsoft.com/v1.0/me');
    await expect(page.locator('#response-area').getByRole('tab', { name: /Response headers/i }))
      .toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--request-area-height')))
      .toBe(selectedHeight);
    await page.locator('#response-area').scrollIntoViewIfNeeded();
    await expectLastLine(page.locator('#response-area'), headerMarker);
  }
  await request.scrollIntoViewIfNeeded();
  await handle.dblclick();
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.style.getPropertyValue('--request-area-height'))).toBe('300px');
});

test('adapts scrolling when banners are dismissed and supports keyboard and wheel navigation', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  const workspace = page.locator('#main-content');
  const initialScrollHeight = await workspace.evaluate(element => element.scrollHeight);
  await page.getByRole('button', { name: 'Dismiss banner', exact: true }).click();
  await expect.poll(() => workspace.evaluate(element => element.scrollHeight)).toBeLessThan(initialScrollHeight);
  await page.getByRole('group').filter({ hasText: 'When you use Microsoft Graph' })
    .getByRole('button', { name: 'dismiss', exact: true }).click();
  await expect.poll(() => workspace.evaluate(element => element.clientHeight)).toBeGreaterThan(252);

  await workspace.evaluate(element => { element.scrollTop = 0; });
  await page.locator('#response-area').getByRole('button', { name: 'Expand', exact: true }).focus();
  await expect.poll(() => workspace.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expect(page.locator('#response-area').getByRole('button', { name: 'Expand', exact: true }))
    .toBeInViewport();

  await workspace.evaluate(element => { element.scrollTop = 0; });
  await page.getByRole('button', { name: 'Run query', exact: true }).hover();
  await page.mouse.wheel(0, 1200);
  await expect.poll(() => workspace.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expectLastLine(page.locator('#response-area'), responseMarker);

  const editor = page.locator('#response-area .monaco-editor');
  await editor.locator('textarea').press('Control+Home');
  const previousScrollTop = await workspace.evaluate(element => element.scrollTop);
  await editor.hover();
  await page.mouse.wheel(0, -1200);
  await expect.poll(() => workspace.evaluate(element => element.scrollTop)).toBeLessThan(previousScrollTop);
});

test('fits an editable request editor and exposes its last line in a compact workspace', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  const request = page.locator('#request-area');
  await request.scrollIntoViewIfNeeded();
  const input = request.locator('.monaco-editor textarea');
  await input.press('Control+A');
  await page.keyboard.insertText([
    ...Array.from({ length: 80 }, (_, index) => `Request line ${index}`),
    'LAYOUT_REQUEST_LAST_LINE'
  ].join('\n'));
  await expectLastLine(request, 'LAYOUT_REQUEST_LAST_LINE');
});

test('keeps the embedded TryIt layout scrollable without a sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page, '/?theme=dark');
  await expect(page.locator('#sidebar-ref')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Toggle sidebar', exact: true })).toHaveCount(0);
  const response = page.locator('#response-area');
  await response.scrollIntoViewIfNeeded();
  await expectLastLine(response, responseMarker);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(384);
});

for (const viewport of [
  { width: 320, height: 768 },
  { width: 412, height: 914 },
  { width: 640, height: 315 },
  { width: 683, height: 384 },
  { width: 768, height: 600 }
]) {
  test(`keeps open sidebar navigation usable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openExplorer(page);
    await seedHistory(page);
    const drawer = await openNavigation(page);
    const close = drawer.getByRole('button', { name: 'Close', exact: true });
    await expectFillsViewport(page, drawer);

    for (const [tab, marker] of sidebarTabs) {
      await selectSidebarTab(drawer, tab);
      await expectPinnedWhileResultsScroll(drawer, tab, marker, viewport.height >= 600);
      await expect(close).toBeInViewport({ ratio: 1 });
    }
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
    const toggle = page.getByRole('button', { name: 'Toggle sidebar', exact: true });
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(viewport.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
  });
}

for (const viewport of [{ width: 1365, height: 500 }, { width: 1365, height: 768 }]) {
  test(`keeps desktop sidebar tabs and search pinned while results scroll at ${viewport.width}x${viewport.height}`,
    async ({ page }) => {
      await page.setViewportSize(viewport);
      await openExplorer(page);
      await seedHistory(page);
      const sidebar = page.locator('#sidebar-ref');
      for (const [tab, marker] of sidebarTabs) {
        await selectSidebarTab(sidebar, tab);
        await expectPinnedWhileResultsScroll(sidebar, tab, marker, viewport.height >= 600);
      }
    });
}

test('keeps mobile navigation open while searching and resizing', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  const drawer = await openNavigation(page);
  const search = drawer.getByRole('searchbox', { name: 'Search sample queries' });
  await search.fill('Layout sample 29');
  await expect(drawer.getByText('Layout sample 29', { exact: true })).toBeVisible();
  // A shorter viewport, such as when a phone keyboard opens, must not dismiss the drawer or reset the search.
  await page.setViewportSize({ width: 683, height: 260 });
  await expect(drawer).toBeVisible();
  await expect(search).toHaveValue('Layout sample 29');
  await page.setViewportSize({ width: 683, height: 384 });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Toggle sidebar', exact: true })).toBeFocused();
});

test('traps keyboard focus and preserves workspace state when navigation is dismissed', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  const response = page.locator('#response-area');
  await response.scrollIntoViewIfNeeded();
  await selectResponseTab(page, response, 'Response headers');
  const workspace = page.locator('#main-content');
  const scrollTop = await workspace.evaluate(element => element.scrollTop);
  const requestHeight = await page.evaluate(() =>
    document.documentElement.style.getPropertyValue('--request-area-height'));
  const drawer = await openNavigation(page);
  const close = drawer.getByRole('button', { name: 'Close', exact: true });
  await close.press('Shift+Tab');
  await expect.poll(() => drawer.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await expect(page.locator('#root')).toHaveAttribute('inert', '');
  expect(await isExposedToAssistiveTechnology(page, 'Close')).toBe(true);
  expect(await isExposedToAssistiveTechnology(page, 'Run query')).toBe(false);
  expect(await isExposedToAssistiveTechnology(page, 'Toggle sidebar')).toBe(false);
  await expect.poll(() => response.locator('[aria-label="Expand"]').evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const target = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    return !!target?.closest('#mobile-sidebar-drawer');
  })).toBe(true);
  await drawer.getByRole('tab', { name: 'History', exact: true }).click();
  await close.click();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Toggle sidebar', exact: true })).toBeFocused();
  await expect.poll(() => workspace.evaluate(element => element.scrollTop)).toBe(scrollTop);
  await expect(page.locator('[aria-label="Query sample input"]')).toHaveValue('https://graph.microsoft.com/v1.0/me');
  await expect(response.getByRole('tab', { name: 'Response headers', exact: true }))
    .toHaveAttribute('aria-selected', 'true');
  expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--request-area-height')))
    .toBe(requestHeight);
  await openNavigation(page);
  await expect(drawer.getByRole('tab', { name: 'History', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();
});

test('selects samples, resources and saved history without automatically running a query', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  await seedHistory(page);
  const requests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/api/proxy?')) {
      requests.push(request.url());
    }
  });
  let drawer = await openNavigation(page);
  await drawer.getByText('Layout sample 29', { exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator('[aria-label="Query sample input"]'))
    .toHaveValue('https://graph.microsoft.com/v1.0/users?$top=30');
  await expect(page.getByRole('button', { name: 'Toggle sidebar', exact: true })).toBeFocused();

  drawer = await openNavigation(page);
  await drawer.getByRole('tab', { name: 'API Explorer', exact: true }).click();
  await drawer.getByText('layoutResource29', { exact: true }).click();
  await drawer.getByText('GET', { exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator('[aria-label="Query sample input"]'))
    .toHaveValue('https://graph.microsoft.com/v1.0/layoutResource29');

  drawer = await openNavigation(page);
  await drawer.getByRole('tab', { name: 'History', exact: true }).click();
  await drawer.getByRole('treeitem').first().click();
  await drawer.getByText('/v1.0/users?$top=30', { exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.locator('[aria-label="Query sample input"]'))
    .toHaveValue('https://graph.microsoft.com/v1.0/users?$top=30');
  await expect(page.locator('#response-area .view-lines')).toContainText('Layout');
  expect(requests).toEqual([]);
  drawer = await openNavigation(page);
  await drawer.getByRole('tab', { name: 'Sample queries', exact: true }).click();
  await drawer.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await page.setViewportSize({ width: 769, height: 600 });
  await expect(page.locator('[aria-label="Query sample input"]'))
    .toHaveValue('https://graph.microsoft.com/v1.0/users?$top=30');
});

test('dismisses nested collection and history overlays before closing navigation', async ({ page }) => {
  await page.setViewportSize({ width: 683, height: 384 });
  await openExplorer(page);
  await seedHistory(page);
  const drawer = await openNavigation(page);
  await drawer.getByRole('tab', { name: 'API Explorer', exact: true }).click();
  const collection = drawer.getByRole('button', { name: /My API Collection:/ });
  await collection.click();
  const collectionDialog = page.getByRole('dialog', { name: 'My API collection', exact: true });
  await expect(collectionDialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(collectionDialog).not.toBeVisible();
  await expect(drawer).toBeVisible();
  await expect(collection).toBeFocused();

  await drawer.getByRole('tab', { name: 'History', exact: true }).click();
  const deleteGroup = drawer.getByRole('button', { name: /^Delete .* queries$/i });
  await deleteGroup.click();
  const confirmation = page.getByRole('dialog', { name: /Delete all requests in the group/ });
  await expect(confirmation).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(confirmation).not.toBeVisible();
  await expect(drawer).toBeVisible();
  await expect(deleteGroup).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();
});

for (const forcedColors of ['none', 'active'] as const) {
  test(`keeps navigation usable in dark mode with forced colors ${forcedColors}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', forcedColors, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 683, height: 384 });
    await page.goto('/');
    const drawer = await openNavigation(page);
    expect(await page.evaluate(() => localStorage.getItem('CURRENT_THEME'))).toBe('dark');
    const marker = drawer.getByText('Layout sample 29', { exact: true });
    await marker.scrollIntoViewIfNeeded();
    await expect(marker).toBeInViewport({ ratio: 1 });
    await expect(drawer.getByRole('button', { name: 'Close', exact: true })).toBeInViewport({ ratio: 1 });
    await expectFillsViewport(page, drawer);
  });
}
