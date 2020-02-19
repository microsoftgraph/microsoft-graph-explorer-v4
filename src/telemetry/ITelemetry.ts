import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ComponentType } from 'react';

export default interface ITelemetry {
  initialize(): void;
  trackEvent(eventName: string, payload: any): void;
  trackReactComponent(Component: ComponentType): ComponentType;
  trackException(error: Error, severityLevel: SeverityLevel): void;
}
