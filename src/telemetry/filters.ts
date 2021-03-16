import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import {
  DEVX_API_URL,
  GRAPH_API_SANDBOX_URL,
  GRAPH_URL,
} from '../app/services/graph-constants';
import {
  sanitizeGraphAPISandboxUrl,
  sanitizeQueryUrl,
} from '../app/utils/query-url-sanitization';

export function filterTelemetryTypes(envelope: ITelemetryItem) {
  const baseType = envelope.baseType || '';
  const telemetryTypesToInclude = [
    'EventData',
    'MetricData',
    'PageviewData',
    'ExceptionData',
    'RemoteDependencyData',
  ];
  return telemetryTypesToInclude.includes(baseType);
}

export function filterRemoteDependencyData(envelope: ITelemetryItem): boolean {
  const baseData = envelope.baseData || {};
  if (envelope.baseType !== 'RemoteDependencyData') {
    return true;
  }

  const targetsToInclude = [GRAPH_URL, DEVX_API_URL, GRAPH_API_SANDBOX_URL];
  const urlObject = new URL(baseData.target || '');
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
    default:
      break;
  }
  return true;
}

export function addCommonTelemetryItemProperties(envelope: ITelemetryItem) {
  const telemetryItem = envelope.baseData || {};
  telemetryItem.properties = telemetryItem.properties || {};

  // Identifies the source of telemetry events
  telemetryItem.properties.ApplicationName = 'Graph Explorer v4';

  // Checks if user is authenticated
  const accessTokenKey = 'msal.idtoken';
  const accessToken = localStorage.getItem(accessTokenKey);
  telemetryItem.properties.IsAuthenticated = accessToken ? true : false;

  return true;
}

export function modifyTelemetryItemProperties(envelope: ITelemetryItem) {
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
