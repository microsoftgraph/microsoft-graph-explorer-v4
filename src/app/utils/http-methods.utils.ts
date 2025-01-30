import { getTheme } from '@fluentui/react';

export type SemanticTextColors =
  | 'brand'
  | 'danger'
  | 'important'
  | 'informative'
  | 'severe'
  | 'subtle'
  | 'success'
  | 'warning';

export function getMethodColor(method?: string): SemanticTextColors {
  switch ((method || '').toUpperCase()) {
  case 'GET':
    return 'brand';
  case 'POST':
    return 'success';
  case 'PUT':
    return 'warning';
  case 'PATCH':
    return 'severe';
  case 'DELETE':
    return 'danger';
  default:
    return 'brand';
  }
}

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