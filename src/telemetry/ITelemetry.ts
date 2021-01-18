import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';

export default interface ITelemetry {
  initialize(): void;
  trackEvent(name: string, properties: {}): void;
  trackReactComponent(Component: ComponentType, componentName?: string): ComponentType;
  trackException(error: Error, severityLevel: SeverityLevel, properties: {}): void;
}
