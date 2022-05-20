export interface IDimensionProperties {
  width: string;
  height: string;
}

export interface IDimensions {
  request: IDimensionProperties;
  response: IDimensionProperties;
  sidebar: IDimensionProperties;
  content: IDimensionProperties;
}