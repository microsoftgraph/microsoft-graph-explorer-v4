export interface ITelemetry {
  startCollectingData(): void;
  collect(eventName: string, payload: any): void;
}