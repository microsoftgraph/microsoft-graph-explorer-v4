import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights, ITelemetryItem, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';
import { validateExternalLink } from '../app/utils/external-link-validation';
import { sanitizeQueryUrl } from '../app/utils/query-url-sanitization';
import { IQuery } from '../types/query-runner';
import { LINK_CLICK_EVENT, TAB_CLICK_EVENT } from './event-types';
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
      disableAjaxTracking: true,
      disableTelemetry: this.getInstrumentationKey() ? false : true,
      extensions: [this.reactPlugin]
    };

    this.appInsights = new ApplicationInsights({
      config: this.config
    });
  }

  public initialize() {
    this.appInsights.loadAppInsights();
    this.appInsights.addTelemetryInitializer(this.includeSpecifiedTelemetryTypes);
    this.appInsights.addTelemetryInitializer(this.filterFunction);
    this.appInsights.trackPageView();
  }

  public trackEvent(name: string, properties: {}) {
    this.appInsights.trackEvent({ name, properties });
  }

  public trackException(error: Error, severityLevel: SeverityLevel, properties: {}) {
    this.appInsights.trackException({ error, severityLevel, properties });
  }

  public trackReactComponent(ComponentToTrack: ComponentType, componentName?: string): ComponentType {
    return withAITracking(this.reactPlugin, ComponentToTrack, componentName);
  }

  public trackTabClickEvent(tabKey: string, sampleQuery: IQuery) {
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    let componentName = tabKey.replace('-', ' ');
    componentName = `${componentName.charAt(0).toUpperCase()}${componentName.slice(1)} tab`;
    telemetry.trackEvent(TAB_CLICK_EVENT,
    {
      ComponentName: componentName,
      QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`
    });
  }

  public trackLinkClickEvent(url: string, componentName: string)  {
    telemetry.trackEvent(LINK_CLICK_EVENT, { ComponentName: componentName });
    validateExternalLink(url, componentName);
  }

  private filterFunction(envelope: ITelemetryItem) {
    const telemetryItem = envelope.baseData || {};
    telemetryItem.properties = telemetryItem.properties || {};

    // Removes access token from uri
    const uri = telemetryItem.uri;
    if (uri) {
      const startOfFragment = uri.indexOf('#');
      const sanitisedUri = uri.substring(0, startOfFragment);
      telemetryItem.uri = sanitisedUri;
    }

    // Identifies the source of telemetry events
    telemetryItem.properties.ApplicationName = 'Graph Explorer v4';

    // Checks if user is authenticated
    const accessTokenKey = 'msal.idtoken';
    const accessToken = localStorage.getItem(accessTokenKey);
    telemetryItem.properties.IsAuthenticated = accessToken ? true : false;

    return true;
  }

  private includeSpecifiedTelemetryTypes(envelope: ITelemetryItem) {
    const baseType = envelope.baseType || '';
    const typesToInclude = ['EventData', 'MetricData', 'ExceptionData', 'PageviewData'];
    if (typesToInclude.includes(baseType)) {
      return true;
    }
    return false;
  }

  private getInstrumentationKey() {
    return (window as any).InstrumentationKey || process.env.REACT_APP_INSTRUMENTATION_KEY || '';
  }
}

export const telemetry = new Telemetry();
