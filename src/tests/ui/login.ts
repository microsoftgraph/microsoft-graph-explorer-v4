import { expect } from '@playwright/test';
require('dotenv').config();

const PLAYWRIGHT_TESTS_USERNAME = process.env.PLAYWRIGHT_TESTS_USERNAME || '';
const PLAYWRIGHT_TESTS_PASSWORD = process.env.PLAYWRIGHT_TESTS_PASSWORD || '';

export const logIn = async (page: any) => {

  await page.goto('/');

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('[aria-label="Sign in"]').click()
  ]);

  await popup.locator('input[name="loginfmt"]').fill(PLAYWRIGHT_TESTS_USERNAME);
  await popup.locator('text=Next').click();
  expect(popup).toBeDefined();

  await popup.locator('[placeholder="Password"]').fill(PLAYWRIGHT_TESTS_PASSWORD);
  await popup.locator('text=Sign in').click();

  expect(popup).toBeDefined();
  await expect(popup).toHaveURL('https://login.microsoftonline.com/common/login');
  await popup.locator('text=Yes').click();
};