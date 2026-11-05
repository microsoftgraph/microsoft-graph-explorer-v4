import { Page } from '@playwright/test';

const localWorkers = new Map<string, Promise<Buffer>>();

/**
 * The app loads Monaco workers from the production CDN, which do not match the locally built editor and throw
 * runtime errors. In development those errors open the webpack error overlay, which disturbs the page under test.
 * Serve the workers built by the local app instead, downloading each one only once per test run.
 */
export async function useLocalMonacoWorkers(page: Page) {
  await page.context().route('**/explorer-v2/build/*.worker.js', async route => {
    const worker = new URL(route.request().url()).pathname.split('/').pop() ?? '';
    if (!localWorkers.has(worker)) {
      const url = new URL(`/${worker}`, process.env.PLAYWRIGHT_TESTS_BASE_URL);
      localWorkers.set(worker, fetch(url).then(async response => Buffer.from(await response.arrayBuffer())));
    }
    const body = await localWorkers.get(worker);
    // The request is abandoned if the test finishes while a worker is still loading.
    await route.fulfill({ contentType: 'text/javascript', body }).catch(() => undefined);
  });
}
