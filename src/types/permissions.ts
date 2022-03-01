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
  }
}

export interface IPermissionState {
  permissions: {
    tabPermissions: IPermission[];
    panelPermissions: IPermission[];
  };
}

export interface IPermissionsResponse {
  scopes: {
    tabPermissions: IPermission[];
    panelPermissions: IPermission[];
  }
}

export interface IScopes {
  pending: boolean;
  data: {
    tabPermissions: IPermission[];
    panelPermissions: IPermission[];
  };
  error: any | null;
}
