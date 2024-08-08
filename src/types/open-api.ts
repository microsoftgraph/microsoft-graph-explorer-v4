export interface OpenApiPath {
  [path: string]: {
    [method: string]: MethodValue;
  };
}

export interface IOpenApiResponse {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  servers: {
    url: string;
    description: string;
  }[];
  paths: OpenApiPath;
}

export interface MethodValue {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: {
    url: string;
    description: string;
  };
  'x-ms-docs-operation-type'?: string;
  operationId: string;

  parameters?: IQueryParameter[],
  requestBody?: RequestBody;
  responses?: any;
}

interface ParamSchema {
  uniqueItems: boolean;
  type: string;
  items: Items;
}

export interface IOpenApiParseContent {
  response: IOpenApiResponse;
  url: string;
}

interface RequestBody {
  description: string;
  required: boolean;
  content: {
    'application/json'?: {
      schema: Schema;
    };
  };
}

interface Schema {
  allOf?: AllOf[];
  properties?: Properties;
}

export interface AllOf extends Property {
  title?: string;
  properties?: Properties;
}

export interface Properties {
  [key: string]: Property | AnyOf | AllOf
}

export interface Property {
  description?: string;
  nullable?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'array' | 'object';
  anyOf?: AnyOf[];
  allOf?: AllOf[];
  items?: {
    anyOf?: AnyOf[];
    allOf: AllOf[]
  };
}

export interface AnyOf extends Property {
  allOf?: AllOf[];
  nullable?: boolean;
  title?: string;
  enum?: string[];
  properties?: Properties;
}


export interface IParsedOpenApiResponse {
  url: string;
  parameters: IParameters[];
  createdAt: string;
  requestBody?: {
    [methodName: string]: any;
  }
}

export interface IParameters {
  verb: string;
  values: IParameterValue[];
  links: string[];
}

export interface IParameterValue {
  name: string;
  items: string[];
}

export interface IQueryParameter {
  name: string;
  in: string;
  description: string;
  style: string;
  explode: boolean;
  schema: ParamSchema;
}

export interface Items {
  enum: string[];
  type: string;
}

