import { ContentType, Mode } from './enums';
import { IQuery } from './query-runner';

export interface IQueryResponseProps {
  mode: Mode;
  dispatch: Function;
  graphResponse?: IGraphResponse;
  verb: string;
  theme: string;
  scopes: string[];
  sampleQuery: IQuery;
  actions: {
    getConsent: Function;
  };
  mobileScreen: boolean;
}

export interface IGraphResponse {
  isLoadingData: boolean;
  response: {
    body: ResponseBody;
    headers: Headers | Record<string, ContentType>;
  }
}


export interface CustomBody {
  throwsCorsError: boolean,
  contentDownloadUrl: string
}
export type ResponseBody = Partial<CustomBody> | Response | string | object | null | undefined;
