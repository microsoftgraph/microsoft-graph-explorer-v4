import * as AdaptiveCardsTemplateAPI from 'adaptivecards-templating';
import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { parseSampleUrl } from '../../utils/sample-url-generation';
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

function lookupTemplate(sampleQuery: IQuery): string {
  if (sampleQuery) {
    const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
    const query = requestUrl + search;
    // find if the url of the request has a template mapped to it
    for (const templateMapKey in templateMap) {
      if (templateMap.hasOwnProperty(templateMapKey)) {
        // check if the template matches a specific pattern while ignoring case
        const isMatch = new RegExp(templateMapKey + '$', 'i').test(query);
        if (isMatch) {
          return templateMap[templateMapKey];
        }
      }
    }
  }
  return '';
}

const templateMap: any = {
  'groups' : 'Groups.json',
  'me': 'Profile.json',
  'me/directReports' : 'Users.json',
  'me/drive/root/children': 'Files.json',
  'me/drive/recent' : 'Files.json',
  'me/manager': 'Profile.json',
  'me/memberOf' : 'Groups.json',
  'me/messages' : 'Messages.json',
  'sites/([^/]+)' : 'Site.json',
  'sites/([^/]+)/sites' : 'Sites.json',
  'users' : 'Users.json',
  'users/([^/]+)' : 'Profile.json'
};