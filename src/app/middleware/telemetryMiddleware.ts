import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { componentNames, errorTypes, telemetry } from '../../telemetry';
import { IAction } from '../../types/action';
import { IQuery } from '../../types/query-runner';
import { IRootState } from '../../types/root';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_SCOPES_ERROR,
  GET_SNIPPET_ERROR,
  SAMPLES_FETCH_ERROR,
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
            Language: action.response.language,
          }
        );
        break;
      }
      case FETCH_SCOPES_ERROR: {
        trackException(
          componentNames.FETCH_PERMISSIONS_ACTION,
          state.sampleQuery,
          action.response.error,
          {
            HasRequestUrl: action.response.hasUrl,
          }
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
