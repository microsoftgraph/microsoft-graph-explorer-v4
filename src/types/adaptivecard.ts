import { IQuery } from './query-runner';

export interface IAdaptiveCardProps {
  body: any;
  card: {
    pending: boolean;
    data?: {
      card: object;
      template: object;
    }
  };
  intl: {
    message: object;
  };
  hostConfig?: any;
  sampleQuery?: IQuery;
  actions?: {
    getAdaptiveCard: Function;
  };
  queryStatus?: any;
}
