export interface IApiFetch {
  pending: boolean;
  data: any[] | object | null | any;
  error: any | null;
}
