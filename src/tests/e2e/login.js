const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriver.path).build());

const driver = new webdriver
  .Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

driver.navigate().to('https://developer.microsoft.com/en-us/graph/graph-explorer/preview');
