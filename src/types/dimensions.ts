export interface IDimensionProperies {
  width: string;
  height: string;
}

export interface IDimensions {
  request: IDimensionProperies;
  response: IDimensionProperies;
  sidebar: IDimensionProperies;
  content: IDimensionProperies;
}