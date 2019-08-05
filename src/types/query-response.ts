
export interface IQueryResponseProps {
  graphResponse?: {
    body: object;
    headers: object;
  };
  isProfileRequest?: boolean;
  intl: {
    message: object;
  };
  verb: string;
}
