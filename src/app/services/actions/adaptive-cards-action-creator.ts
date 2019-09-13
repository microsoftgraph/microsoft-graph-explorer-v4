import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
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

    const template = lookupTemplate(sampleQuery);
    if (!template) {
      // we dont support this card yet
      return dispatch(getAdaptiveCardError('No template available'));
    }

    const url = `https://templates.adaptivecards.io/graph.microsoft.com/${template}`;
    const body = JSON.stringify(payload);
    dispatch(getAdaptiveCardPending());

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).then(resp => resp.json())
      .then((result) => {
        if (result.error) {
          throw (result.error);
        }
        // give back the result of the card
        return dispatch(getAdaptiveCardSuccess(result));
      })
      .catch(error => {
        // something wrong happened
        return dispatch(getAdaptiveCardError(error));
      });
  };
}

function lookupTemplate(sampleQuery: IQuery) : string {
  if (sampleQuery) {
    const urlObject: URL = new URL(sampleQuery.sampleUrl);
    // remove the prefix i.e. beta or v1.0 and any possible extra whack character at the end'/'
    const query = urlObject.pathname.substr(6).replace(/\/$/, '') + urlObject.search;
    return templateMap[query];
  }
  return '';
}

const templateMap: any = {
  'me': 'Profile.json',
  'me/manager': 'Profile.json',
  'me/drive/root/children': 'Files.json'
};