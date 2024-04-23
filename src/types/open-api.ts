export interface IOpenApiResponse {
  paths: {
    [path: string]: {
      [method: string]: MethodValue;
    };
  };
}

export interface MethodValue {
  summary: string;
  operationId: string;

  tags?: string[];
  externalDocs?: {
    description: string,
    url: string
  };
  parameters?: IQueryParameter[],
  requestBody?: RequestBody;
  responses: any;
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

export interface AllOf {
  title: string;
  type: string;
  properties: Properties;
}

interface Properties {
  [key: string]: any | AnyOf | AllOf
}

interface AnyOf {
  allOf?: AllOf[];
  type?: string;
  nullable?: boolean;
  title?: string;
  enum?: string[];
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

