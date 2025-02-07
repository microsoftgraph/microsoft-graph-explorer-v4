import { getTheme } from '@fluentui/react';

type BadgeColors =
  | 'brand'
  | 'danger'
  | 'important'
  | 'informative'
  | 'severe'
  | 'subtle'
  | 'success'
  | 'warning';

export const methodColors: Record<string, BadgeColors> = {
  GET: 'brand',
  POST: 'success',
  PATCH: 'severe',
  DELETE: 'danger',
  PUT: 'warning'
};

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