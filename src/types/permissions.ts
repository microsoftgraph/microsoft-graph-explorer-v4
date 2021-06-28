import { ITheme } from '@uifabric/styling';
import { IDimensions } from './dimensions';
import { IQuery } from './query-runner';

export interface IPermission {
  value: string;
  consentDescription: string;
  isAdmin: boolean;
  consented: boolean;
}

export interface IPermissionProps {
  theme?: ITheme;
  styles?: object;
  dimensions: IDimensions;
  scopes: IScopes;
  panel: boolean;
  sample: IQuery[];
  tokenPresent: boolean;
  permissionsPanelOpen: boolean;
  consentedScopes: string[];
  setPermissions: Function;
  actions?: {
    fetchScopes: Function;
    consentToScopes: Function;
  };
  permissionModeType: boolean;
}

export interface IPermissionState {
  permissions: IPermission[];
}

export interface IPermissionsResponse {
  hasUrl: boolean;
  scopes: IPermission[];
}

export interface IScopes {
  pending: boolean;
  data: IPermission[];
  hasUrl: boolean;
  error: any | null;
}
