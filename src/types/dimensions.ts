export interface IDimensionProperies {
    width: string;
    height: string;
}

export interface IDimensions {
    sidebar: IDimensionProperies;
    content: IDimensionProperies;
    request: IDimensionProperies;
    response: IDimensionProperies;
}