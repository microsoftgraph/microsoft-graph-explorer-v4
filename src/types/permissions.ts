import { ITheme } from '@fluentui/react';
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
  dimensions?: IDimensions;
  permissionsPanelOpen?: boolean;
  setPermissions?: Function;
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
  pending: boolean;
  data: {
    specificPermissions: IPermission[];
    fullPermissions: IPermission[];
  };
  error: any | null;
}
