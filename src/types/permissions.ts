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
  permissionsRef?: any
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
    isTenantWidePermissionsGrant?: boolean;
  };
  data: {
    specificPermissions: IPermission[];
    fullPermissions: IPermission[];
    tenantWidePermissionsGrant?: any
  };
  error: any | null;
}
