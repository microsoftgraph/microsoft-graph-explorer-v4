import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';
import ITelemetry from './ITelemetry';

class Telemetry implements ITelemetry {
  private appInsights: ApplicationInsights;
  private config: any;
  private reactPlugin: any;

  constructor() {
    const { mscc } = (window as any);

    this.reactPlugin  = new ReactPlugin();
    this.config = {
      instrumentationKey: this.getInstrumentationKey(),
      disableExceptionTracking: true,
      disableTelemetry: this.getInstrumentationKey() ? false : true,
      extensions: [this.reactPlugin]
    };

    this.appInsights = new ApplicationInsights({
      config: this.config
    });
  }

  public initialize() {
    this.appInsights.loadAppInsights();
    this.appInsights.addTelemetryInitializer(this.filterFunction);
    this.appInsights.trackPageView();
  }

  public trackEvent(eventName: string, payload: any) {
    this.appInsights.trackEvent({ name: eventName }, payload);
  }

  public trackException(error: Error, severityLevel: SeverityLevel) {
    this.appInsights.trackException({ error, severityLevel });
  }

  public trackReactComponent(ComponentToTrack: ComponentType): ComponentType {
    return withAITracking(this.reactPlugin, ComponentToTrack);
  }

  private filterFunction(envelope: any) {
    // Identifies the source of telemetry events
    envelope.baseData.name = 'Graph Explorer v4';
  }

  private getInstrumentationKey() {
    const instrumentationKey = process.env.REACT_APP_INSTRUMENTATION_KEY;
    return instrumentationKey || '';
  }
}

export const telemetry = new Telemetry();
