import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';

import { IAdaptiveCardContent } from '../../../../types/adaptivecard';
import { IQuery } from '../../../../types/query-runner';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';

export function getAdaptiveCard(payload: string, sampleQuery: IQuery): IAdaptiveCardContent {
  if (!payload) {
    // no payload so return empty result
    throw new Error('No adaptive card payload available');
  }

  if (Object.keys(payload).length === 0) {
    // check if the payload is something else that we cannot use
    throw new Error('Invalid adaptive card payload');
  }

  const templateFileName = lookupTemplate(sampleQuery);
  if (!templateFileName) {
    // we don't support this card yet
    throw new Error('Adaptive card is not supported yet');
  }

  try {
    const card = createCardFromTemplate(templateFileName, payload);
    const adaptiveCardContent: IAdaptiveCardContent = {
      card,
      template: templateFileName
    };
    return adaptiveCardContent;
  } catch (err: unknown) {
    // something wrong happened
    const error = err as Error;
    throw error.message;
  }
}

function createCardFromTemplate(templatePayload: object, payload: string): AdaptiveCardsTemplateAPI.Template {
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