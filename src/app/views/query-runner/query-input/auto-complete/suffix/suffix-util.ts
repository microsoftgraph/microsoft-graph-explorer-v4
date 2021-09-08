import { FontWeights, mergeStyleSets } from '@fluentui/react';

import { IQuery, ISampleQuery } from '../../../../../../types/query-runner';
import { GRAPH_URL } from '../../../../../services/graph-constants';
import { sanitizeQueryUrl } from '../../../../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../../../../utils/sample-url-generation';

export interface IHint {
  link: {
    url: string;
    name: string;
  };
  title: string;
  description: string;
}

export interface ISampleFilter {
  queries: ISampleQuery[];
  sampleQuery: IQuery;
  sampleUrl: string;
  queryRunnerStatus: any
}

export const styles = mergeStyleSets({
  iconButton: {
    cursor: 'pointer'
  },
  callout: {
    width: 320,
    padding: '20px 24px',
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  link: {
    display: 'block',
    marginTop: 20,
  },
});

export const getMatchingSamples = (filterParams: ISampleFilter): ISampleQuery[] => {
  const { queries, sampleQuery, sampleUrl, queryRunnerStatus } = filterParams;
  const querySamples: ISampleQuery[] = [];
  queries
    .filter((sample: ISampleQuery) => sample.method === sampleQuery.selectedVerb)
    .forEach((sample: ISampleQuery) => {
      const { requestUrl: baseUrl, queryVersion: version } =
        parseSampleUrl(sanitizeQueryUrl(GRAPH_URL + sample.requestUrl));
      const baseUrlMatches = `/${version}/${baseUrl}` === sampleUrl;
      if (baseUrlMatches) {
        querySamples.push(sample);
      }
    });
  if (querySamples.length > 1) {
    const tipFilter = filterQueriesUsingTip(querySamples, queryRunnerStatus);
    if (tipFilter.length > 1) {
      return filterQueriesUsingQueryParameters(querySamples, sampleQuery);
    }
    return tipFilter;
  }
  return querySamples;
};

function filterQueriesUsingTip(querySamples: ISampleQuery[], queryRunnerStatus: any) {
  if (queryRunnerStatus && queryRunnerStatus.statusText === 'Tip') {
    const exact = querySamples.filter(k => k.tip === queryRunnerStatus.status);
    if (exact.length === 1) {
      return exact;
    }
  }
  return querySamples;
};

function filterQueriesUsingQueryParameters(querySamples: ISampleQuery[], sampleQuery: IQuery) {
  const { search } = parseSampleUrl(sampleQuery.sampleUrl);
  if (search) {
    const parameters: string[] = [];
    const splitSearch = search.split('&');
    if (splitSearch.length > 0) {
      splitSearch.forEach(element => {
        const parameter = element.substring(element.indexOf('$') + 1, element.lastIndexOf('='));
        parameters.push(parameter);
      });

      const list: ISampleQuery[] = [];
      parameters.forEach(param => {
        const fit = querySamples.find(k => k.requestUrl.includes(param));
        if (fit) {
          list.push(fit);
        }
      });

      if (list.length > 0) {
        return list.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      }
    }
  }
  return querySamples;
}
