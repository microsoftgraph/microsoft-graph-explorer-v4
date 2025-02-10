import { tokens } from '@fluentui/react-components';

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
  method = method?.toUpperCase();
  const styles: Record<string, string> = {
    GET: tokens.colorBrandBackground,
    POST: tokens.colorStatusSuccessForeground1,
    PUT: tokens.colorStatusWarningForeground2,
    PATCH: tokens.colorStatusWarningForeground3,
    DELETE: tokens.colorStatusDangerForeground1
  };

  return styles[method] || tokens.colorNeutralForeground1;
}
