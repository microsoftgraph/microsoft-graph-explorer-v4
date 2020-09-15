import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';
import { sanitizeUrl } from '../app/utils/sample-url-sanitizer';
import ITelemetry from './ITelemetry';

class Telemetry implements ITelemetry {
  private appInsights: ApplicationInsights;
  private config: any;
  private reactPlugin: any;

  constructor() {
    this.reactPlugin = new ReactPlugin();

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
    envelope.tags['ai.cloud.role'] = 'Graph Explorer v4';

    // Redact PII from query url
    const properties = envelope.baseData.properties || {};
    for (const property in properties) {
      if (property === 'QueryUrl')
      {
        const queryUrl = sanitizeUrl(properties[property]);
        envelope.baseData.properties[property] = queryUrl;
      }
    }

    // Removes access token from uri
    const uri = envelope.baseData.uri;
    if (uri) {
      const startOfFragment = uri.indexOf('#');
      const sanitisedUri = uri.substring(0, startOfFragment);
      envelope.baseData.uri = sanitisedUri;
    }

    return true;
  }

  private getInstrumentationKey() {
    return (window as any).InstrumentationKey || process.env.REACT_APP_INSTRUMENTATION_KEY || '';
  }
}

export const telemetry = new Telemetry();
