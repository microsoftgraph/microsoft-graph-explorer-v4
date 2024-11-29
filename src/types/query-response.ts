import { Person, ResponseType, User } from '@microsoft/microsoft-graph-types';
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

export interface ResponseValue {
  id: string
}

export interface CustomBody {
  throwsCorsError: boolean,
  contentDownloadUrl: string,
  error: Error,
  value: Partial<User & Person>[] | undefined

}
export type ResponseBody = Partial<CustomBody> | Response | string | object | null | undefined;
