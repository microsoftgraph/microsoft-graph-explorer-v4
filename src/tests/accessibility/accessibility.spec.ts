import AxeBuilder from '@axe-core/webdriverjs';
import webdriver, { ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const TEST_TIMEOUT_MS = 300000; // in milliseconds = 5min

describe('Graph Explorer accessibility', () => {
  let driver: ThenableWebDriver;

  // set browser environment to use headless Chrome
  beforeAll(async () => {
    const service = new chrome.ServiceBuilder(process.env.REACT_APP_CHROMEDRIVER_PATH).build();
    chrome.setDefaultService(service);

    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
  }, TEST_TIMEOUT_MS);

  // end browser environment
  afterAll(async () => {
    return driver && driver.quit();
  }, TEST_TIMEOUT_MS);

  // load the page where app is hosted
  beforeEach(async () => {
    await driver
      .manage()
      .setTimeouts({ implicit: 0, pageLoad: 60000, script: TEST_TIMEOUT_MS });
    await driver.get('http://localhost:3000/');
  }, TEST_TIMEOUT_MS);

  // scan the page and return an analysis
  it('checks for accessibility violations', async () => {
    const accessibilityScanResults = await new AxeBuilder(driver)
      // disabled as main landmark already exists on live site
      .disableRules([
        'landmark-one-main',
        'region',
        'document-title',
        'html-has-lang',
        'page-has-heading-one',
        'button-name',
        'landmark-is-unique'
      ])
      .analyze();
    expect(accessibilityScanResults.violations).toStrictEqual([]);
  });
});
