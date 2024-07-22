import { AuthenticateResult } from './authentication';
import { AutocompleteResponse } from './auto-complete';
import { IDevxAPI } from './devx-api';
import { IDimensions } from './dimensions';
import { Mode } from './enums';
import { IHistoryItem } from './history';
import { IScopes, PermissionGrantsState } from './permissions';
import { IProfileState } from './profile';
import { IGraphResponse } from './query-response';
import { IQuery, ISampleQuery } from './query-runner';
import { Collection, IResources } from './resources';
import { ISidebarProps } from './sidebar';
import { ISnippet } from './snippets';
import { IStatus } from './status';

export interface ApplicationState {
  theme: string;
  graphExplorerMode?: Mode;
  profile: IProfileState;
  queryRunnerStatus?: IStatus | null;
  sampleQuery: IQuery;
  termsOfUse: boolean;
  sidebarProperties: ISidebarProps;
  auth: AuthenticateResult;
  samples: {
    queries: ISampleQuery[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  permissionGrants: PermissionGrantsState;
  scopes: IScopes;
  history: IHistoryItem[];
  graphResponse: IGraphResponse;
  snippets: ISnippet;
  responseAreaExpanded: boolean;
  dimensions: IDimensions;
  autoComplete: AutocompleteResponse;
  devxApi: IDevxAPI;
  resources: IResources;
  collections?: Collection[];
}

export interface IApiFetch {
  pending: boolean;
  data: any[] | object | null | any;
  error: any | null;
}
