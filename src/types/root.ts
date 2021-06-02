import { IAdaptiveCardResponse } from './adaptivecard';
import { IAuthenticate } from './authentication';
import { IAutocompleteResponse } from './auto-complete';
import { IDimensions } from './dimensions';
import { Mode } from './enums';
import { IHistoryItem } from './history';
import { IScopes } from './permissions';
import { IUser } from './profile';
import { IGraphResponse } from './query-response';
import { IQuery, ISampleQuery } from './query-runner';
import { ISidebarProps } from './sidebar';
import { ISnippet } from './snippets';
import { IStatus } from './status';

export interface IRootState {
  theme: string;
  adaptiveCard: IAdaptiveCardResponse;
  graphExplorerMode: Mode;
  profile: IUser | undefined | null;
  queryRunnerStatus: IStatus | null;
  sampleQuery: IQuery;
  termsOfUse: boolean;
  sidebarProperties: ISidebarProps;
  authToken: IAuthenticate;
  samples: ISampleQuery[];
  consentedScopes: string[];
  scopes: IScopes;
  history: IHistoryItem[];
  graphResponse: IGraphResponse;
  permissionsPanelOpen: boolean;
  isLoadingData: boolean;
  snippets: ISnippet;
  responseAreaExpanded: boolean;
  dimensions: IDimensions;
  autoComplete: IAutocompleteResponse;
}

export interface IApiFetch {
  pending: boolean;
  data: any[] | object | null | any;
  error: any | null;
}