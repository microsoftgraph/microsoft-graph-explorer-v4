import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { ApplicationAnalytics, ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';
import ITelemetry from './ITelemetry';

class Telemetry implements ITelemetry {
  private appInsights: ApplicationInsights;
  private config: any;

  constructor() {
    this.config = {
      instrumentationKey: process.env.REACT_APP_INSTRUMENTATION_KEY,
    };

    this.appInsights = new ApplicationInsights({
      config: this.config
    });
  }

  public initialize() {
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
  }

  public collect(eventName: string, payload: any) {
    if (!this.valid(eventName)) {
      throw new Error('Invalid telemetry event name');
    }

    this.appInsights.trackEvent({ name: eventName }, payload);
  }

  public trackException(error: Error) {
    const exception = { error };
    this.appInsights.trackException(exception);
  }

  public trackComponent(ComponentToTrack: ComponentType): ComponentType {
    const reactPlugin = new ReactPlugin();
    const appInsightsAnalytics = new ApplicationAnalytics();
    appInsightsAnalytics.initialize(this.config, this.appInsights.core, []);
    reactPlugin.initialize(this.config, this.appInsights.core, [appInsightsAnalytics]);

    return withAITracking(reactPlugin, ComponentToTrack);
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
