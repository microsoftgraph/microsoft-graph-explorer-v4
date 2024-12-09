import { getTheme } from '@fluentui/react';
import { ResponseBody } from '../../types/query-response';

export function getStyleFor(method: string) {
  const currentTheme = getTheme();
  method = method?.toUpperCase();

  switch (method) {
  case 'GET':
    return currentTheme.palette.blue;

  case 'POST':
    return currentTheme.palette.green;

  case 'PUT':
    return currentTheme.palette.magentaDark;

  case 'PATCH':
    return currentTheme.palette.orange;

  case 'DELETE':
    return currentTheme.palette.redDark;

  default:
    return currentTheme.palette.orangeLight;
  }
}

export function getHeaders(response: ResponseBody) {
  const headers: Record<string, string> = {};
  if(response instanceof Response){
    for (const entry of response.headers.entries()) {
      headers[entry[0]] = entry[1];
    }
  }
  return headers;
}

