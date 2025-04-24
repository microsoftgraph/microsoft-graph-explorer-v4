import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';

export interface IAdaptiveCardContent {
  card?: AdaptiveCardsTemplateAPI.Template | object;
  template: object;
}
