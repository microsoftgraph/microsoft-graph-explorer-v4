import { ITheme } from '@fluentui/react';
import { IDimensions } from './dimensions';

export interface IPermission {
  value: string;
  consentDescription: string;
  isAdmin: boolean;
  consented: boolean;
}

export interface IPermissionProps {
  theme?: ITheme;
  styles?: object;
  dimensions?: IDimensions;
  setPermissions?: Function;
  panel?: boolean;
}

export interface IPermissionState {
  permissions: {
    specificPermissions: IPermission[];
    fullPermissions: IPermission[];
  };
}

export interface IPermissionsResponse {
  scopes: {
    specificPermissions: IPermission[];
    fullPermissions: IPermission[];
  }
}

export interface IScopes {
  pending: {
    isSpecificPermissions: boolean;
    isFullPermissions: boolean;
  };
  data: {
    specificPermissions: IPermission[];
    fullPermissions: IPermission[];
  };
  error: any | null;
}

export interface IUnconsent {
  pending: boolean;
  error: any | null;
  data: string[];
}
