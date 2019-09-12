import { IQuery } from './query-runner';

export interface IAdaptiveCardProps {
    body: any;
    card: {
      pending: boolean;
      data?: any;
    };
    sampleQuery?: IQuery;
    actions?: {
      getAdaptiveCard: Function;
    };
  }