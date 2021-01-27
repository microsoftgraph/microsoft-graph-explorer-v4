import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';
import { IQuery } from '../types/query-runner';

export default interface ITelemetry {
  initialize(): void;
  trackEvent(name: string, properties: {}): void;
  trackReactComponent(Component: ComponentType, componentName?: string): ComponentType;
  trackTabClickEvent(tabKey: string, sampleQuery: IQuery): void;
  trackLinkClickEvent(url: string, componentName: string): void;
  trackException(error: Error, severityLevel: SeverityLevel, properties: {}): void;
}
