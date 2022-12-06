import { expect, Page } from '@playwright/test';
require('dotenv').config();

const PLAYWRIGHT_TESTS_USERNAME = process.env.PLAYWRIGHT_TESTS_USERNAME || '';
const PLAYWRIGHT_TESTS_PASSWORD = process.env.PLAYWRIGHT_TESTS_PASSWORD || '';

export const logIn = async (page: any) : Promise<Page> => {

  await page.goto('/');
  await expect(page.locator('label:has-text("Sample")')).toBeVisible();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('[aria-label="Sign in"]').click()
  ]);

  await popup.locator('input[name="loginfmt"]').fill(PLAYWRIGHT_TESTS_USERNAME);
  await popup.locator('text=Next').click();
  await expect(popup).toBeDefined();

  await popup.locator('[placeholder="Password"]').fill(PLAYWRIGHT_TESTS_PASSWORD);
  await popup.locator('text=Sign in').click();
  await expect(popup).toHaveURL('https://login.microsoftonline.com/common/login');
  const finalStep = popup.locator('text=Yes');
  if (finalStep) {
    await finalStep.click();
  }
  return page;
};