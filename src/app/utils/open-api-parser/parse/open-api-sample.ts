import { IOpenApiResponse, OpenApiPath } from '../../../../types/open-api';
import sample from './open-api-sample.json';

export function getSample(): IOpenApiResponse {
  const response: IOpenApiResponse = {
    openapi: sample.openapi,
    info: sample.info,
    servers: sample.servers,
    paths: sample.paths as unknown as OpenApiPath
  };

  return response;
}

