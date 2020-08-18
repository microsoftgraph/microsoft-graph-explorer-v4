import AxeBuilder from 'axe-webdriverjs';
import chromeDriver from 'chromedriver';
import webdriver, { ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
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
    await driver.manage().setTimeouts( { implicit: 0, pageLoad:
      60000, script: TEST_TIMEOUT_MS });
    await driver.get('https://developer.microsoft.com/en-us/graph/graph-explorer/preview');
  }, TEST_TIMEOUT_MS);

  it('checks for accessibility violations', async() => {
    // @ts-ignore
    const accessibilityScanResults = await AxeBuilder(driver)
      .include('#root')
      .analyze();
    expect(accessibilityScanResults.violations).toStrictEqual([]);
  });
});
