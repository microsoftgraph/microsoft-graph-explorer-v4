import { ComponentType } from 'react';

export default interface ITelemetry {
  startCollectingData(): void;
  collect(eventName: string, payload: any): void;
  trackComponent(Component: ComponentType): ComponentType;
}