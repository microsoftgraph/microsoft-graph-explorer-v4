import * as Axe from 'axe-core';
import { convertAxeToSarif } from 'axe-sarif-converter';
import AxeBuilder from 'axe-webdriverjs';
import chromeDriver from 'chromedriver';
import webdriver, { By, ThenableWebDriver, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const TEST_TIMEOUT_MS = 300000;

describe('Graph Explorer', () => {
  let driver: ThenableWebDriver;

  beforeAll(async () => {
    chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriver.path).build());

    driver = new webdriver
    .Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  }, TEST_TIMEOUT_MS);

  afterAll(async() => {
    return driver && driver.quit();
  }, TEST_TIMEOUT_MS);

  beforeEach(async() => {
    await driver.get('https://developer.microsoft.com/en-us/graph/graph-explorer/preview');
    await driver.wait(until.elementLocated(By.css('p')));
  }, TEST_TIMEOUT_MS);

  it('checks for accessibility violations', async() => {
    // @ts-ignore
    const accessibilityScanResults = await AxeBuilder(driver)
      .analyze();
    expect(accessibilityScanResults.violations).toStrictEqual([]);
  });
});