import { telemetry, eventTypes, componentNames } from '../../../../telemetry';
import { ISampleQuery } from '../../../../types/query-runner';
import { GRAPH_URL } from '../../../services/graph-constants';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

function performSearch(queries: ISampleQuery[], value: string): ISampleQuery[] {
  const keyword = value.toLowerCase();
  return queries.filter((sample: any) => {
    const name = sample.humanName.toLowerCase();
    const category = sample.category.toLowerCase();
    return name.includes(keyword) || category.includes(keyword);
  });
}

const trackSampleQueryClickEvent = (query: ISampleQuery) => {
  const sanitizedUrl = sanitizeQueryUrl(GRAPH_URL + query.requestUrl);
  telemetry.trackEvent(
    eventTypes.LISTITEM_CLICK_EVENT,
    {
      ComponentName: componentNames.SAMPLE_QUERY_LIST_ITEM,
      SampleId: query.id,
      SampleName: query.humanName,
      SampleCategory: query.category,
      QuerySignature: `${query.method} ${sanitizedUrl}`
    });
}

const trackDocumentLinkClickedEvent = async (item: ISampleQuery): Promise<void> => {
  const properties: { [key: string]: any } = {
    ComponentName: componentNames.DOCUMENTATION_LINK,
    SampleId: item.id,
    SampleName: item.humanName,
    SampleCategory: item.category,
    Link: item.docLink
  };
  telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, properties);

  // Check if link throws error
  validateExternalLink(item.docLink || '', componentNames.DOCUMENTATION_LINK, item.id);
}

interface ShouldRunQueryArgs {
  method: string;
  url: string;
  authenticated: boolean;
}

const shouldRunQuery = ({ method, url, authenticated }: ShouldRunQueryArgs): boolean => {
  const isPOSTException = method === 'POST' && url.contains('search/query');
  const shouldRun = method === 'GET' || authenticated || isPOSTException;
  return shouldRun;
}

export {
  trackDocumentLinkClickedEvent,
  trackSampleQueryClickEvent,
  performSearch,
  isJsonString,
  shouldRunQuery
}
