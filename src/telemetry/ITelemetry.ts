import { ComponentType } from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

export default interface ITelemetry {
  initialize(): void;
  trackEvent(eventName: string, payload: any): void;
  trackReactComponent(Component: ComponentType): ComponentType;
  trackException(error: Error, severityLevel: SeverityLevel): void;
}
