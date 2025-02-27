/* eslint-disable max-len */
import {
  ReactPlugin,
  withAITracking
} from '@microsoft/applicationinsights-react-js';
import {
  ApplicationInsights,
  SeverityLevel
} from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';

import variantService from '../app/services/variant-service';
import {
  getBrowserScreenSize,
  getDeviceScreenScale
} from '../app/utils/device-characteristics-telemetry';
import { validateExternalLink } from '../app/utils/external-link-validation';
import { sanitizeQueryUrl } from '../app/utils/query-url-sanitization';
import '../app/utils/string-operations';
import { getVersion } from '../app/utils/version';
import { IQuery } from '../types/query-runner';
import {
  BUTTON_CLICK_EVENT,
  LINK_CLICK_EVENT,
  TAB_CLICK_EVENT,
  WINDOW_OPEN_EVENT
} from './event-types';
import {
  addCommonTelemetryItemProperties,
  filterRemoteDependencyData,
  filterResizeObserverExceptions,
  filterTelemetryTypes,
  sanitizeTelemetryItemUriProperty
} from './filters';
import ITelemetry from './ITelemetry';

class Telemetry implements ITelemetry {
  private appInsights: ApplicationInsights;
  private config: any;
  private reactPlugin: ReactPlugin;

  constructor() {
    this.reactPlugin = new ReactPlugin();

    this.config = {
      connectionString: this.getConnectionString(),
      disableExceptionTracking: false, // Enables autocollection of uncaught exceptions. Used with `sanitizeStackTrace` telemetry initializer to remove any data that might be PII.
      disableAjaxTracking: false,
      disableFetchTracking: false, // Enables capturing of telemetry data for outgoing requests. Used with `filterRemoteDependencyData` telemetry initializer to sanitize captured data to prevent inadvertent capture of PII.
      disableTelemetry: this.getConnectionString() ? false : true,
      extensions: [this.reactPlugin]
    };

    this.appInsights = new ApplicationInsights({
      config: this.config
    });
  }

  public initialize() {
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
    this.appInsights.addTelemetryInitializer(filterResizeObserverExceptions);
    this.appInsights.addTelemetryInitializer(filterTelemetryTypes);
    this.appInsights.addTelemetryInitializer(filterRemoteDependencyData);
    this.appInsights.addTelemetryInitializer(sanitizeTelemetryItemUriProperty);
    this.appInsights.addTelemetryInitializer(addCommonTelemetryItemProperties);
    this.appInsights.context.application.ver = getVersion().toString();
  }

  public trackEvent(name: string, properties:{ AssignmentContext?: string, [key: string]: any } = {}) {
    const defaultProperties = { AssignmentContext: variantService.getAssignmentContext() };
    const mergedProperties = { ...defaultProperties, ...properties };
    this.appInsights.trackEvent({ name, properties: mergedProperties });
  }

  public trackException(
    error: Error,
    severityLevel: SeverityLevel,
    properties: {}
  ) {
    this.appInsights.trackException({ error, severityLevel, properties });
  }

  public trackReactComponent<T>(
    ComponentToTrack: ComponentType<T>,
    componentName?: string
  ): ComponentType<T> {
    return withAITracking(this.reactPlugin, ComponentToTrack, componentName);
  }

  public trackTabClickEvent(tabKey: string, sampleQuery?: IQuery) {
    const componentName = tabKey.replace('-', ' ').toSentenceCase();
    const properties: { [key: string]: any } = {
      ComponentName: `${componentName} tab`
    };
    if (sampleQuery) {
      const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
      properties.QuerySignature = `${sampleQuery.selectedVerb} ${sanitizedUrl}`;
    }
    telemetry.trackEvent(TAB_CLICK_EVENT, properties);
  }

  public trackLinkClickEvent(url: string, componentName: string) {
    telemetry.trackEvent(LINK_CLICK_EVENT, { ComponentName: componentName });
    validateExternalLink(url, componentName);
  }

  public trackCopyButtonClickEvent(
    componentName: string,
    sampleQuery?: IQuery,
    properties?: { [key: string]: string }
  ) {
    properties = properties || {};
    properties.ComponentName = componentName;
    if (sampleQuery) {
      const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
      properties.QuerySignature = `${sampleQuery.selectedVerb} ${sanitizedUrl}`;
    }
    telemetry.trackEvent(BUTTON_CLICK_EVENT, properties);
  }

  public trackWindowOpenEvent(windowEvent: string, properties?: any) {
    properties = properties || {};
    properties.ComponentName = windowEvent;
    telemetry.trackEvent(WINDOW_OPEN_EVENT, properties);
  }

  public getDeviceCharacteristicsData() {
    return {
      deviceHeight: screen.height.toString(),
      deviceWidth: screen.width.toString(),
      browserScreenSize: getBrowserScreenSize(window.innerWidth),
      browserHeight: window.innerHeight.toString(),
      browserWidth: window.innerWidth.toString(),
      scale: getDeviceScreenScale()
    };
  }

  private getInstrumentationKey(): string {
    return (
      (window as any).InstrumentationKey ||
      process.env.REACT_APP_INSTRUMENTATION_KEY ||
      ''
    );
  }

  private getConnectionString(): string {
    return (
      (window as any).ConnectionString ||
      process.env.REACT_APP_CONNECTION_STRING ||
      ''
    );
  }

  public getUserId(){
    try {
      const userId = document.cookie.split(';').filter((item) => item.trim().startsWith('ai_user')).map((item) => item.split('=')[1])[0];
      return userId.split('|')[0];
    } catch (error) {
      return '';
    }
  }
}

export const telemetry = new Telemetry();
