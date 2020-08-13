import { ITheme } from '@uifabric/styling';
import { IQuery } from './query-runner';

export interface IPermission {
  value: string;
  consentDisplayName: string;
  consentDescription: string;
  isAdmin: boolean;
  consented: boolean;
}

export interface IPermissionProps {
  theme?: ITheme;
  styles?: object;
  scopes: {
    data: IPermission[];
    pending: boolean;
    error: object;
  };
  panel: boolean;
  sample: IQuery[];
  tokenPresent: boolean;
  consentedScopes: string[];
  setPermissions: Function;
  actions?: {
    fetchScopes: Function;
    consentToScopes: Function;
  };
}

export interface IPermissionState {
  permissions: IPermission[];
  groups: string[];
}
