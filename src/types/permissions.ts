import { ITheme } from '@fluentui/react';
import { IDimensions } from './dimensions';
import { ScopesError } from '../app/utils/error-utils/ScopesError';

export interface IPermission {
  value: string;
  consentDescription: string;
  isAdmin: boolean;
  consented: boolean;
  consentType?: 'Principal' | 'AllPrinripal';
  isLeastPrivilege?: boolean;
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
  };
  data: {
    specificPermissions: IPermission[];
    fullPermissions: IPermission[];
  };
  error: ScopesError | null;
}

export interface PermissionGrantsState {
  pending: boolean;
  error: string | null;
  permissions: IPermissionGrant[];
}

export interface IPermissionGrant {
  clientId: string;
  consentType: string;
  principalId: string | null;
  resourceId: string;
  scope: string;
  id?: string
}

export interface IOAuthGrantPayload {
  value: IPermissionGrant[];
  '@odata.context': string;
}
