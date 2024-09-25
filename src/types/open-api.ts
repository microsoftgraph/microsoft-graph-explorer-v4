export interface IOpenApiResponse {
  paths: any;
  info: IOpenApiInfo;
}

export interface IOpenApiInfo {
  version: string;
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: IOpenApiContact;
  license?: IOpenApiLicense;
}

export interface IOpenApiContact {
  name: string;
  url: string;
  email: string;
}

export interface IOpenApiLicense {
  name: string;
  url: string;
}
export interface IOpenApiParseContent {
  response: IOpenApiResponse;
  url: string;
}

export interface IParsedOpenApiResponse {
  url: string;
  parameters: IParameters[];
  version: string;
  createdAt: string;
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
  schema: ISchema;
}

export interface ISchema {
  uniqueItems: boolean;
  type: string;
  items: Items;
}

export interface Items {
  enum: string[];
  type: string;
}

export interface IPathValue {
  tags: string[];
  summary: string;
  operationId: string;
  requestBody: any;
  responses: any;
  parameters: IQueryParameter[];
}
