import AxeBuilder from 'axe-webdriverjs';
import chromedriver from 'chromedriver';
import webdriver, { ThenableWebDriver } from 'selenium-webdriver';
import chrome, { Options } from 'selenium-webdriver/chrome';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
const TEST_TIMEOUT_MS = 300000;

describe('Graph Explorer', () => {
   let driver: ThenableWebDriver;

  // set browser environment to use headless Chrome
  beforeAll(async () => {
    chrome.setDefaultService(new chrome.ServiceBuilder('C:\\SeleniumWebDrivers\\ChromeDriver\\chromedriver.exe')
    .build());

    driver = new webdriver
    .Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().headless())
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  }, TEST_TIMEOUT_MS);

  // end browser environment
  afterAll(async() => {
    return driver && driver.quit();
  }, TEST_TIMEOUT_MS);

  // load the page where app is hosted
  beforeEach(async() => {
    await driver.manage().setTimeouts( { implicit: 0, pageLoad:
      60000, script: TEST_TIMEOUT_MS });
    await driver.get('http://localhost:3000/');
  }, TEST_TIMEOUT_MS);

  // scan the page and return an analysis
  it('checks for accessibility violations', async() => {
    // @ts-ignore
    const accessibilityScanResults = await AxeBuilder(driver)
      .disableRules(['landmark-one-main', 'region']) // disabled as main landmark already exists on live site
      .analyze();
    expect(accessibilityScanResults.violations).toStrictEqual([]);
  });
});
