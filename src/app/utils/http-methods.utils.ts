import { getTheme } from '@fluentui/react';

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

export function getHeaders(response: Response) {
  const headers: Record<string, string> = {};
  for (const entry of response.headers.entries()) {
    if (Object.prototype.hasOwnProperty.call(response.headers, entry[0])) {
      headers[entry[0]] = entry[1];
    }
  }
  return headers;
}

