import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';
import ITelemetry from './ITelemetry';

class Telemetry implements ITelemetry {
  private appInsights: ApplicationInsights;
  private config: any;
  private reactPlugin: any;

  constructor() {
    this.reactPlugin  = new ReactPlugin();
    this.config = {
      instrumentationKey: process.env.REACT_APP_INSTRUMENTATION_KEY,
      disableExceptionTracking: true,
      disableTelemetry: this.areWeInDev() ? false : true,
      extensions: [this.reactPlugin]
    };

    this.appInsights = new ApplicationInsights({
      config: this.config
    });
  }

  public initialize() {
    this.appInsights.loadAppInsights();

    this.appInsights.trackPageView();
  }

  public trackEvent(eventName: string, payload: any) {
    if (!this.valid(eventName)) {
      throw new Error('Invalid telemetry event name');
    }

    this.appInsights.trackEvent({ name: eventName }, payload);
  }

  public trackException(error: Error, severityLevel: SeverityLevel) {
    this.appInsights.trackException({ error, severityLevel });
  }

  public trackReactComponent(ComponentToTrack: ComponentType): ComponentType {
    return withAITracking(this.reactPlugin, ComponentToTrack);
  }

  // A valid event name ends with the word EVENT
  private valid(eventName: string): boolean {
    const listOfWords = eventName.split('_');
    const lastIndex = listOfWords.length - 1;
    const lastWord = listOfWords[lastIndex];
    return lastWord === 'EVENT';
  }

  private areWeInDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}

export const telemetry = new Telemetry();
