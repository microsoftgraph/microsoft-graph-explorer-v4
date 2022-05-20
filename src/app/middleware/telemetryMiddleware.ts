import { SeverityLevel } from '@microsoft/applicationinsights-web';
import {
  componentNames,
  errorTypes,
  eventTypes,
  telemetry
} from '../../telemetry';
import { IAction } from '../../types/action';
import { IQuery } from '../../types/query-runner';
import { IRootState } from '../../types/root';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_SCOPES_ERROR,
  GET_SNIPPET_ERROR,
  RESOURCEPATHS_ADD_SUCCESS,
  RESOURCEPATHS_DELETE_SUCCESS,
  SAMPLES_FETCH_ERROR
} from '../services/redux-constants';
import { sanitizeQueryUrl } from '../utils/query-url-sanitization';

const telemetryMiddleware =
  (store: any) => (next: any) => async (action: IAction) => {
    const state: IRootState = store.getState();
    switch (action.type) {
      case GET_SNIPPET_ERROR: {
        trackException(
          componentNames.GET_SNIPPET_ACTION,
          state.sampleQuery,
          action.response.error,
          {
            Language: action.response.language
          }
        );
        break;
      }
      case FETCH_SCOPES_ERROR: {
        trackException(
          componentNames.FETCH_PERMISSIONS_ACTION,
          state.sampleQuery,
          action.response.error,
          {}
        );
        break;
      }
      case SAMPLES_FETCH_ERROR: {
        trackException(
          componentNames.FETCH_SAMPLES_ACTION,
          state.sampleQuery,
          action.response,
          {}
        );
        break;
      }
      case FETCH_ADAPTIVE_CARD_ERROR: {
        trackException(
          componentNames.GET_ADAPTIVE_CARD_ACTION,
          state.sampleQuery,
          action.response,
          {}
        );
        break;
      }
      case RESOURCEPATHS_ADD_SUCCESS: {
        telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT, {
          ComponentName: componentNames.ADD_RESOURCE_TO_COLLECTION_LIST_ITEM,
          ResourcePath: action.response[0].url
        });
        break;
      }
      case RESOURCEPATHS_DELETE_SUCCESS: {
        telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT, {
          ComponentName: componentNames.REMOVE_RESOURCE_FROM_COLLECTION_BUTTON,
          ResourceCount: action.response.length
        });
        break;
      }
    }
    return next(action);
  };

function trackException(
  componentName: string,
  sampleQuery: IQuery,
  error: any,
  properties: { [key: string]: any }
): void {
  let errorType: string = errorTypes.OPERATIONAL_ERROR;
  let errorMessage: string = JSON.stringify(error);

  if (error instanceof Response) {
    errorType = errorTypes.NETWORK_ERROR;
    errorMessage = `ApiError: ${error.status}`;
  }

  if (sampleQuery.sampleUrl) {
    const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
    properties.QuerySignature = `${sampleQuery.selectedVerb} ${sanitizedUrl}`;
  }

  properties.Message = errorMessage;
  properties.ComponentName = componentName;
  telemetry.trackException(
    new Error(errorType),
    SeverityLevel.Error,
    properties
  );
}

export default telemetryMiddleware;
