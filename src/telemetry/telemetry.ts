import { ApplicationInsights } from '@microsoft/applicationinsights-web';

class Telemetry {
  private appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: 'a800ae98-f89e-4f96-b491-cf1b8a989bff',
      }
    });
  }

  public startCollectingData() {
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
  }

  public collect(eventName: string, payload: any) {
    if (!this.valid(eventName)) {
      throw new Error('Invalid telemetry event name');
    }

    // @ts-ignore
    this.appInsights.trackEvent(eventName, payload);
  }

  // A valid event name ends with the word EVENT
  private valid(eventName: string): boolean {
    const listOfWords = eventName.split('_');
    const lastIndex = listOfWords.length - 1;
    const lastWord = listOfWords[lastIndex];
    return lastWord === 'EVENT';
  }
}

export const telemetry = new Telemetry();