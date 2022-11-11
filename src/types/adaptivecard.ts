import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';


export interface IAdaptiveCardContent {
  card?: AdaptiveCardsTemplateAPI.Template;
  template: any;
}

export interface IAdaptiveCardResponse {
  pending: boolean;
  data?: IAdaptiveCardContent;
  error?: string;
}
