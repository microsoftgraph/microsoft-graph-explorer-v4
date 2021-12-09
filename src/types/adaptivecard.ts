import { IQuery } from './query-runner';
import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';

export interface IAdaptiveCardProps {
  body: any;
  card: {
    pending: boolean;
    data?: IAdaptiveCardContent
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

export interface IAdaptiveCardContent {
  card?: AdaptiveCardsTemplateAPI.Template;
  template: any;
}

export interface IAdaptiveCardResponse {
  pending: boolean;
  data?: IAdaptiveCardContent;
  error?: string;
}