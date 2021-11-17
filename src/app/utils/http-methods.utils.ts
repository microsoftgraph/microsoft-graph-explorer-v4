import { getTheme } from '@fluentui/react';

export function getStyleFor(method: string) {
  const currentTheme = getTheme();
  method = method.toUpperCase();

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

export function getMethodIcon(method: string) {
  if (!method) {
    return 'CheckboxFill';
  }
  method = method.toUpperCase();
  switch (method) {
    case 'GET':
      return 'DrillDown'

    case 'POST':
      return 'Sync';

    case 'PATCH':
      return 'WindowEdit';

    case 'PUT':
      return 'SortLines';

    default:
      return 'DependencyRemove';
  }
}
