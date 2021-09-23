import templates from '../../graph-toolkit-examples';
import { IQuery } from '../../types/query-runner';
import { GRAPH_TOOOLKIT_EXAMPLE_URL } from '../services/graph-constants';
import { parseSampleUrl } from './sample-url-generation';

export function lookupToolkitUrl(sampleQuery: IQuery) {
  if (sampleQuery) {
    const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
    const query = '/' + requestUrl + search;
    for (const templateMapKey in templates) {
      if (templates.hasOwnProperty(templateMapKey)) {
        const isMatch = new RegExp(templateMapKey + '$', 'i').test(query);
        if (isMatch) {
          const url: string = (templates as any)[templateMapKey];
          let { search: componentUrl } = parseSampleUrl(url);
          componentUrl = componentUrl.replace('?id=', '');
          return {
            exampleUrl: `${GRAPH_TOOOLKIT_EXAMPLE_URL}/${componentUrl}`,
            toolkitUrl: url
          };
        }
      }
    }
  }
  return { toolkitUrl: null, exampleUrl: null };
}
