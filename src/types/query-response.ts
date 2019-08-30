
export interface IQueryResponseProps {
  dispatch: Function;
  graphResponse?: {
    body: object;
    headers: object;
  };
  intl: {
    message: object;
  };
  verb: string;
}
