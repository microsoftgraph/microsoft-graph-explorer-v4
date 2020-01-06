import { ComponentType } from 'react';

export default interface ITelemetry {
  initialize(): void;
  collect(eventName: string, payload: any): void;
  trackComponent(Component: ComponentType): ComponentType;
}
