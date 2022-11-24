export interface HarFormat {
  log: Log;
}

interface Log {
  version: string;
  creator: Creator;
  pages: Page[];
  entries: Entry[];
}

export interface Entry {
  startedDateTime: string;
  time: number;
  request: Request;
  response: Response;
  cache: Cache;
  timings: Timings;
  pageref: string;
}

interface Timings {
  blocked: number;
  dns: number;
  connect: number;
  send: number;
  wait: number;
  receive: number;
  ssl: number;
}

interface Cache {
  beforeRequest?: object;
  afterRequest?: object;
  comment?: string;
}

interface Response {
  status: number;
  statusText: string;
  httpVersion: string;
  headers: HarHeader[];
  cookies: any[];
  content: Content;
  redirectURL: string;
  headersSize: number;
  bodySize: number;
}

interface Content {
  size: number;
  mimeType: string;
  compression: number;
  text: string;
}

interface Request {
  method: string;
  url: string;
  httpVersion: string;
  headers: HarHeader[];
  queryString: HarHeader[];
  cookies: Cookie[];
  headersSize: number;
  bodySize: number;
  postData?: Content;
}

interface Cookie {
  name: string;
  value: string;
  expires?: any;
  httpOnly: boolean;
  secure: boolean;
}

export interface HarHeader {
  name: string;
  value: string;
}

interface Page {
  startedDateTime: string;
  id: string;
  title: string;
  pageTimings: PageTimings;
}

interface PageTimings {
  onContentLoad: number;
  onLoad: number;
}

interface Creator {
  name: string;
  version: string;
}