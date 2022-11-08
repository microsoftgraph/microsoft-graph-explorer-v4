import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';
import { AppDispatch } from '../../../store';
import { AppAction } from '../../../types/action';
import { IAdaptiveCardContent } from '../../../types/adaptivecard';
import { IQuery } from '../../../types/query-runner';
import { lookupTemplate } from '../../utils/adaptive-cards-lookup';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_PENDING,
  FETCH_ADAPTIVE_CARD_SUCCESS
} from '../redux-constants';

export function getAdaptiveCardSuccess(result: object): AppAction {
  return {
    type: FETCH_ADAPTIVE_CARD_SUCCESS,
    response: result
  };
}

export function getAdaptiveCardError(error: string): AppAction {
  return {
    type: FETCH_ADAPTIVE_CARD_ERROR,
    response: error
  };
}

export function getAdaptiveCardPending(): AppAction {
  return {
    type: FETCH_ADAPTIVE_CARD_PENDING,
    response: ''
  };
}

export function getAdaptiveCard(payload: string, sampleQuery: IQuery) {
  return async (dispatch: AppDispatch): Promise<AppAction> => {
    if (!payload) {
      // no payload so return empty result
      return dispatch(getAdaptiveCardSuccess({}));
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
    try {
      const card = createCardFromTemplate(templateFileName, payload);
      const adaptiveCardContent: IAdaptiveCardContent = {
        card,
        template: templateFileName
      };
      return dispatch(getAdaptiveCardSuccess(adaptiveCardContent));
    } catch (error: any) {
      // something wrong happened
      return dispatch(getAdaptiveCardError(error));
    }
  };
}

function createCardFromTemplate(templatePayload: any, payload: string): AdaptiveCardsTemplateAPI.Template {
  const template = new AdaptiveCardsTemplateAPI.Template(templatePayload);
  const context: AdaptiveCardsTemplateAPI.IEvaluationContext = {
    $root: payload
  };
  AdaptiveCardsTemplateAPI.GlobalSettings.getUndefinedFieldValueSubstitutionString = (
    // eslint-disable-next-line no-unused-vars
    _path: string
  ) => ' ';
  return template.expand(context);
}

