import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';
import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { lookupTemplate } from '../../utils/adaptive-cards-lookup';
import {
  FETCH_ADAPTIVE_CARD_ERROR ,
  FETCH_ADAPTIVE_CARD_PENDING,
  FETCH_ADAPTIVE_CARD_SUCCESS
} from '../redux-constants';

export function getAdaptiveCardSuccess(result: string = ''): IAction {
  return {
    type: FETCH_ADAPTIVE_CARD_SUCCESS,
    response: result,
  };
}

export function getAdaptiveCardError(error: string): IAction {
  return {
    type: FETCH_ADAPTIVE_CARD_ERROR,
    response: error
  };
}

export function getAdaptiveCardPending(): IAction {
  return {
    type: FETCH_ADAPTIVE_CARD_PENDING,
    response: ''
  };
}

export function getAdaptiveCard(payload: string, sampleQuery: IQuery): Function {
  return async (dispatch: Function) => {

    if (!payload) {
      // no payload so return empty result
      return dispatch(getAdaptiveCardSuccess());
    }

    if (Object.keys(payload).length === 0) {
      // check if the payload is something else that we cannot use
      return dispatch(getAdaptiveCardError('Invalid payload for card'));
    }

    const templateFileName = lookupTemplate(sampleQuery);
    if (!templateFileName) {
      // we dont support this card yet
      return dispatch(getAdaptiveCardError('No template available'));
    }

    dispatch(getAdaptiveCardPending());

    return fetch(`https://templates.adaptivecards.io/graph.microsoft.com/${templateFileName}`)
      .then(resp => resp.json())
      .then((fetchResult) => {
        if (fetchResult.error) {
          throw (fetchResult.error);
        }
        // create a card from the template
        const template = new AdaptiveCardsTemplateAPI.Template(fetchResult);
        const context = new AdaptiveCardsTemplateAPI.EvaluationContext();
        context.$root = payload;
        const card = template.expand(context);
        // give back the result of the card
        return dispatch(getAdaptiveCardSuccess(card));
      })
      .catch(error => {
        // something wrong happened
        return dispatch(getAdaptiveCardError(error));
      });
  };
}
