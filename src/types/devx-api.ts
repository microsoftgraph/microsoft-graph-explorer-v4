export interface IDevxAPI {
  baseUrl: string;
  org?: string;
  branchName?: string;
  custom?: boolean;
  accountKey?: string;
  eligible?: boolean;
  revision?: number;
  pending?: boolean;
  requestId?: string;
  error?: string | null;
}