import { SeverityLevel } from '@microsoft/applicationinsights-web';
import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';
import { componentNames, errorTypes, telemetry } from '../../../telemetry';
import { IAction } from '../../../types/action';
import { IAdaptiveCardContent } from '../../../types/adaptivecard';
import { IQuery } from '../../../types/query-runner';
import { lookupTemplate } from '../../utils/adaptive-cards-lookup';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_PENDING,
  FETCH_ADAPTIVE_CARD_SUCCESS,
} from '../redux-constants';

export function getAdaptiveCardSuccess(result: object): IAction {
  return {
    type: FETCH_ADAPTIVE_CARD_SUCCESS,
    response: result,
  };
}

export function getAdaptiveCardError(error: string): IAction {
  return {
    type: FETCH_ADAPTIVE_CARD_ERROR,
    response: error,
  };
}

export function getAdaptiveCardPending(): IAction {
  return {
    type: FETCH_ADAPTIVE_CARD_PENDING,
    response: '',
  };
}

export function getAdaptiveCard(
  payload: string,
  sampleQuery: IQuery
): Function {
  return async (dispatch: Function) => {
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
      const response = await fetch(`https://templates.adaptivecards.io/graph.microsoft.com/${templateFileName}`);
      const templatePayload = await response.json();
      const card = createCardFromTemplate(templatePayload, payload);
      const adaptiveCardContent: IAdaptiveCardContent = { card, template: templatePayload };
      return dispatch(getAdaptiveCardSuccess(adaptiveCardContent));

    } catch (error) {
      // something wrong happened
      const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
      telemetry.trackException(
        new Error(errorTypes.NETWORK_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.GET_ADAPTIVE_CARD_ACTION,
          QuerySignature: `${sampleQuery.selectedVerb} ${sanitizedUrl}`,
          Message: `${error}`
        }
      );
      return dispatch(getAdaptiveCardError(error));
    }
  };
}

function createCardFromTemplate(templatePayload: any, payload: string): AdaptiveCardsTemplateAPI.Template {
  const template = new AdaptiveCardsTemplateAPI.Template(templatePayload);
  const context: AdaptiveCardsTemplateAPI.IEvaluationContext = {
    $root: payload,
  };
  AdaptiveCardsTemplateAPI.GlobalSettings.getUndefinedFieldValueSubstitutionString = (
    _path: string
  ) => ' ';
  return template.expand(context);
}

