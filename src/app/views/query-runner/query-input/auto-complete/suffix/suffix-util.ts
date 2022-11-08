
import { IQuery, ISampleQuery } from '../../../../../../types/query-runner';
import { IResource } from '../../../../../../types/resources';
import { GRAPH_URL } from '../../../../../services/graph-constants';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import {
  getMatchingResourceForUrl, getResourcesSupportedByVersion
} from '../../../../../utils/resources/resources-filter';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';

export interface IHint {
  link?: {
    url: string;
    name: string;
  };
  description?: string;
}

export interface FilterParams {
  source: ISampleQuery[] | IResource[];
  sampleQuery: IQuery;
}

const getSampleDocumentationUrl = (filterParams: FilterParams): string => {
  const samples = getMatchingSamples(filterParams);
  return (samples.length > 0) ? samples[0].docLink || '' : '';
}

const getMatchingSamples = (filterParams: FilterParams): ISampleQuery[] => {
  const { sampleQuery } = filterParams;
  const queries = filterParams.source as ISampleQuery[];
  const { requestUrl, queryVersion } =
    parseSampleUrl(sanitizeQueryUrl(sampleQuery.sampleUrl));
  const method = filterParams.sampleQuery.selectedVerb;

  const sampleUrl = `/${queryVersion}/${requestUrl}`;

  const querySamples: ISampleQuery[] = [];
  queries
    .filter((sample: ISampleQuery) => sample.method === method)
    .forEach((sample: ISampleQuery) => {
      const { requestUrl: baseUrl, queryVersion: version } =
        parseSampleUrl(sanitizeQueryUrl(GRAPH_URL + sample.requestUrl));
      const baseUrlMatches = `/${version}/${baseUrl}` === sampleUrl;
      if (baseUrlMatches) {
        querySamples.push(sample);
      }
    });
  return querySamples;
};


const getResourceDocumentationUrl = (filterParams: FilterParams): string | null => {

  const { requestUrl, queryVersion } = parseSampleUrl(sanitizeQueryUrl(filterParams.sampleQuery.sampleUrl));
  const resources = filterParams.source as IResource[];
  const method = filterParams.sampleQuery.selectedVerb;

  const supportedResources = getResourcesSupportedByVersion(resources, queryVersion);
  const matchingResource = getMatchingResourceForUrl(requestUrl, supportedResources)!;

  if (matchingResource && matchingResource.labels.length > 0) {
    const currentLabel = matchingResource.labels.filter(k => k.name === queryVersion)[0];
    const methodLabel = currentLabel.methods.find((value) =>
      value.name.toLowerCase() === method.toLowerCase());
    return methodLabel?.documentationUrl!;
  }
  return null;
}

export {
  getSampleDocumentationUrl,
  getResourceDocumentationUrl
};

