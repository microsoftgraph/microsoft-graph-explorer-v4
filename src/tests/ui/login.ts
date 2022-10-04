import { expect } from '@playwright/test';

const PLAYWRIGHT_TESTS_USERNAME = process.env.PLAYWRIGHT_TESTS_USERNAME;
const PLAYWRIGHT_TESTS_PASSWORD = process.env.PLAYWRIGHT_TESTS_PASSWORD;

export const logIn = async (page: any) => {

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    await page.locator('[aria-label="Sign in"]').click()
  ]);

  await popup.waitForLoadState();
  await expect(popup).toHaveTitle(/sign in to your account/i);

  await popup.locator('input[name="loginfmt"]').fill(PLAYWRIGHT_TESTS_USERNAME!);
  await popup.locator('text=Next').click();
  await popup.locator('input[name="passwd"]').fill(PLAYWRIGHT_TESTS_PASSWORD!);
  await popup.locator('text=Sign in').click();
};