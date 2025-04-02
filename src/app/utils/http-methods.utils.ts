import { ResponseBody } from '../../types/query-response';
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

export function getHeaders(response: ResponseBody) {
  const headers: Record<string, string> = {};
  if(response instanceof Response){
    for (const entry of response.headers.entries()) {
      headers[entry[0]] = entry[1];
    }
  }
  return headers;
}

