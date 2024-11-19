import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import {
  GRAPH_API_SANDBOX_URL,
  GRAPH_TOOOLKIT_EXAMPLE_URL,
  GRAPH_URL,
  HOME_ACCOUNT_KEY,
  NPS_FEEDBACK_URL
} from '../app/services/graph-constants';
import {
  sanitizeGraphAPISandboxUrl,
  sanitizeQueryUrl
} from '../app/utils/query-url-sanitization';
import { store } from '../store';

export function filterTelemetryTypes(envelope: ITelemetryItem) {
  const baseType = envelope.baseType || '';
  const telemetryTypesToInclude = [
    'EventData',
    'MetricData',
    'PageviewData',
    'ExceptionData',
    'RemoteDependencyData'
  ];
  return telemetryTypesToInclude.includes(baseType);
}

export function filterRemoteDependencyData(envelope: ITelemetryItem): boolean {
  if (envelope.baseType === 'RemoteDependencyData') {
    const baseData = envelope.baseData || {};

    const urlObject = new URL(baseData.target || '');

    const graphProxyUrl = store.getState()?.proxyUrl;
    const devxApiUrl = process.env.REACT_APP_DEVX_API_URL || '';

    const targetsToInclude = [
      GRAPH_URL,
      new URL(devxApiUrl).origin,
      GRAPH_API_SANDBOX_URL,
      new URL(graphProxyUrl).origin,
      new URL(GRAPH_TOOOLKIT_EXAMPLE_URL).origin,
      new URL(NPS_FEEDBACK_URL).origin
    ];
    if (!targetsToInclude.includes(urlObject.origin)) {
      return false;
    }

    const target = baseData.target || '';
    switch (urlObject.origin) {
    case GRAPH_URL:
      baseData.name = sanitizeQueryUrl(target);
      break;
    case GRAPH_API_SANDBOX_URL:
      baseData.name = sanitizeGraphAPISandboxUrl(target);
      break;
    default:
      break;
    }
  }
  return true;
}

export function addCommonTelemetryItemProperties(envelope: ITelemetryItem) {
  const telemetryItem = envelope.baseData || {};
  telemetryItem.properties = telemetryItem.properties || {};

  // Identifies the source of telemetry events
  telemetryItem.properties.ApplicationName = 'Graph Explorer v4';

  // Checks if user is authenticated
  const accessTokenKey = HOME_ACCOUNT_KEY;
  const accessToken = localStorage.getItem(accessTokenKey);
  telemetryItem.properties.IsAuthenticated = !!accessToken;

  // Capture GE Mode for all telemetry items
  const geMode = store.getState()?.graphExplorerMode;
  telemetryItem.properties.GraphExplorerMode = geMode;

  return true;
}

export function sanitizeTelemetryItemUriProperty(envelope: ITelemetryItem) {
  // Remove access token from URI
  const telemetryItem = envelope.baseData || {};
  const uri = telemetryItem.uri;
  if (uri) {
    const startOfFragment = uri.indexOf('#');
    const sanitisedUri = uri.substring(0, startOfFragment);
    telemetryItem.uri = sanitisedUri;
  }
  return true;
}

export function filterResizeObserverExceptions(envelope: ITelemetryItem){
  if (envelope.data?.message === 'ErrorEvent: ResizeObserver loop limit exceeded') {
    return false;
  }
}