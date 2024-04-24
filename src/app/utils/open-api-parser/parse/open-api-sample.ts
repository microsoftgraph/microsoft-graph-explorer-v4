import { IOpenApiResponse } from '../../../../types/open-api';
import sample from './open-api-sample.json';

export function getSample(): IOpenApiResponse {
  return {
    openapi: sample.openapi,
    info: sample.info,
    servers: sample.servers,
    paths: sample.paths
  };
}

