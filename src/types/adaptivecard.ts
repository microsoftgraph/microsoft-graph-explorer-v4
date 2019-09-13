import { IQuery } from './query-runner';

export interface IAdaptiveCardProps {
    body: any;
    card: {
      pending: boolean;
      data?: any;
    };
    hostConfig?: any;
    sampleQuery?: IQuery;
    actions?: {
      getAdaptiveCard: Function;
    };
  }