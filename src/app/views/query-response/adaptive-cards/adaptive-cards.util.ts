import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';

import { IAdaptiveCardContent } from '../../../../types/adaptivecard';
import { IQuery } from '../../../../types/query-runner';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';

// Function to safely parse JSON string
function safeJsonParse(jsonString: string): object | null {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

// Accept payload as string OR object
export function getAdaptiveCard(payload: string | object, sampleQuery: IQuery): IAdaptiveCardContent | undefined {
  if (!payload) {
    throw new Error('No adaptive card payload available');
  }

  let parsedPayload: object | null;

  // Check if payload is a string and needs parsing, or if it's already an object
  if (typeof payload === 'string') {
    parsedPayload = safeJsonParse(payload);
  } else if (typeof payload === 'object' && payload !== null) {
    parsedPayload = payload;
  } else {
    throw new Error('Invalid payload type for card');
  }


  if (!parsedPayload || (typeof parsedPayload === 'object' && Object.keys(parsedPayload).length === 0)) {
    throw new Error('Invalid or empty payload for card');
  }

  const templateFileName = lookupTemplate(sampleQuery);
  if (!templateFileName || typeof templateFileName !== 'object') {
    return undefined; // No template available for this query
  }

  try {
    const expandedCard = createCardFromTemplate(templateFileName, parsedPayload);

    if (typeof expandedCard !== 'object' || expandedCard === null) {
      throw new Error('Template expansion failed to produce a valid card object.');
    }

    const adaptiveCardContent: IAdaptiveCardContent = {
      card: expandedCard,
      template: templateFileName
    };
    return adaptiveCardContent;
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(`Failed to create card from template: ${error.message}`);
  }
}

// templatePayload is the template JSON object, payloadData is the parsed data JSON object
function createCardFromTemplate(templatePayload: object, payloadData: object): unknown {
  try {
    if (typeof templatePayload !== 'object' || templatePayload === null) {
      throw new Error('Invalid template object provided to createCardFromTemplate.');
    }

    const template = new AdaptiveCardsTemplateAPI.Template(templatePayload);

    const context: AdaptiveCardsTemplateAPI.IEvaluationContext = {
      $root: payloadData
    };
    AdaptiveCardsTemplateAPI.GlobalSettings.getUndefinedFieldValueSubstitutionString = (_path: string) => ' ';
    const expandedResult = template.expand(context);
    return expandedResult;

  } catch (expansionError) {
    throw new Error(`Error during template expansion: ${(expansionError as Error).message}`);
  }
}