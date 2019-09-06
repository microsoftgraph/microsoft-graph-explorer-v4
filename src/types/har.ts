interface IHarLog {
  version: string;
  creator: IHarCreator;
  browser?: IHarBrowser;
  entries: IHarEntries[];
  comment?: string;
}

interface IHarCreator {
  name: string;
  version: string;
  comment?: string;
}

interface IHarBrowser {
  name: string;
  version: string;
  comment?: string;
}

interface IHarEntries {
  pageref?: string;
  startedDateTime: string;
  time: number;
  request: IHarRequest;
  response: IHarResponse;
  cache: IHarCache;
  timings: IHarTimings;
  serverIpAddress?: string;
  connection?: string;
  comment?: string;
}

interface IHarRequest {
  method: string;
  url: string;
  httpVersion: string;
  cookies: IHarCookies[];
  headers: IHarHeaders[];
  queryString: IHarQueryString[];
  postData?: IHarPostData;
  headersSize: number;
  bodySize: number;
  comment?: string;
}

interface IHarResponse {
  status: number;
  statusText: string;
  httpVersion: string;
  cookies: IHarCookies[];
  headers: IHarHeaders[];
  content: IHarContent;
  redirectURL: string;
  headersSize: number;
  bodySize: number;
  comment?: string;
}

interface IHarCookies {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: string;
  httpOnly?: boolean;
  secure?: boolean;
  comment?: string;
}

interface IHarHeaders {
  name: string;
  value: string;
  comment?: string;
}

interface IHarQueryString {
  name: string;
  value: string;
  comment?: string;
}

interface IHarPostData {
  mimeType: string;
  params?: IHarParams;
  text: string;
  comment?: string;
}

interface IHarParams {
  name: string;
  value?: string;
  fileName?: string;
  contentType?: string;
  comment?: string;
}

interface IHarContent {
  size: number;
  compression?: number;
  mimeType: string;
  text?: string;
  encoding?: string;
  comment?: string;
}

interface IHarCache {
  beforeRequest?: object;
  afterRequest?: object;
  comment?: string;
}

interface IHarTimings {
  blocked?: number;
  dns?: number;
  connect?: number;
  send: number;
  wait: number;
  receive: number;
  ssl?: number;
  comment?: string;
}

export interface IHarFormat {
  log: IHarLog;
}

export interface IHarPayload {
  startedDateTime: string;
  time: number;
  method: string;
  url: string;
  httpVersion: string;
  cookies: IHarCookies[];
  request: {
    headers: IHarHeaders[];
  };
  response: {
    headers: IHarHeaders[];
  };
  queryString: IHarQueryString[];
  postData?: IHarPostData;
  status: number;
  statusText: string;
  content: IHarContent;
  sendTime: number;
  waitTime: number;
  receiveTime: number;
}
