export interface Info {
  _postman_id: string;
  name: string;
  schema: string;
}

export interface Query {
  key: string;
  value: string;
}

export interface Url {
  raw: string;
  protocol: string;
  host: string[];
  path: string[];
  query?: Query[];
}

export interface Request {
  method: string;
  header?: any[];
  url: Url;
}

export interface Item {
  name: string;
  request: Request;
  response?: any[];
}

export interface IPostmanCollection {
  info: Info;
  item: Item[];
}
