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

  await popup.locator('[placeholder="Password"]').fill(PLAYWRIGHT_TESTS_PASSWORD);
  await popup.locator('text=Sign in').click();

  await expect(popup).toHaveURL('https://login.microsoftonline.com/common/login');
  const finalStep = popup.locator('text=Yes');
  if(finalStep.isVisible()) {
    await finalStep.click();
  }
};