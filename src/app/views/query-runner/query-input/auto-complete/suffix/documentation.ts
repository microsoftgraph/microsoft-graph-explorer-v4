
import { IQuery, ISampleQuery } from '../../../../../../types/query-runner';
import { IResource, ResourceMethod } from '../../../../../../types/resources';
import { GRAPH_URL } from '../../../../../services/graph-constants';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import {
  getMatchingResourceForUrl
} from '../../../../../utils/resources/resources-filter';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';

interface FilterParams {
  source: ISampleQuery[] | IResource[];
  sampleQuery: IQuery;
}

interface IDocumentationService {
  getDocumentationLink(): string;
}

class DocumentationService implements IDocumentationService {
  protected source;
  protected sampleQuery;
  protected requestUrl;
  protected queryVersion;
  protected method;

  constructor(filterParams: FilterParams) {
    this.source = filterParams.source;
    this.sampleQuery = filterParams.sampleQuery;
    const { requestUrl, queryVersion } = parseSampleUrl(sanitizeQueryUrl(this.sampleQuery.sampleUrl));
    this.queryVersion = queryVersion;
    this.requestUrl = requestUrl;
    this.method = this.sampleQuery.selectedVerb;
  }

  public getDocumentationLink = (): string => {
    const link = this.getSampleDocumentationUrl() || this.getResourceDocumentationUrl();
    return link || '';
  }

  private getSampleDocumentationUrl = (): string => {
    const samples = this.getMatchingSamples();
    return (samples.length > 0) ? samples[0].docLink || '' : '';
  }

  private getMatchingSamples = (): ISampleQuery[] => {
    const queries = this.source as ISampleQuery[];
    const sampleUrl = `/${this.queryVersion}/${this.requestUrl}`;
    const querySamples: ISampleQuery[] = [];

    queries
      .filter((sample: ISampleQuery) => sample.method === this.method)
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


  private getResourceDocumentationUrl = (): string | null => {
    const resources = this.source as IResource[];
    const matchingResource = getMatchingResourceForUrl(this.requestUrl, resources)!;

    if (matchingResource && matchingResource.labels.length > 0) {
      const currentLabel = matchingResource.labels.filter(k => k.name === this.queryVersion)[0];

      const method = currentLabel?.methods[0];
      if (typeof method === 'string') {
        return null;
      }

      if (typeof method === 'object') {
        let methods = currentLabel.methods;
        methods = methods as ResourceMethod[];
        return methods.find((value: ResourceMethod) =>
          value.name?.toLowerCase() === this.method.toLowerCase())?.documentationUrl!;
      }
    }
    return null;
  }
}

export default DocumentationService;
