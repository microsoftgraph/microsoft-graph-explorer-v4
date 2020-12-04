import { SeverityLevel } from '@microsoft/applicationinsights-web';
import templates from '../../graph-toolkit-examples';
import { telemetry } from '../../telemetry';
import { LINK_ERROR } from '../../telemetry/error-types';
import { IQuery } from '../../types/query-runner';
import { parseSampleUrl } from './sample-url-generation';


async function validateToolkitUrl(url: string, componentName: string): Promise<void> {
  await fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
      })
      .catch(error => {
        telemetry.trackException(
          new Error(LINK_ERROR),
          SeverityLevel.Error,
          {
            ComponentName: componentName,
            Message: error
          });
      });
 }

export function lookupToolkitUrl(sampleQuery: IQuery) {
  if (sampleQuery) {
    const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
    const query = '/' + requestUrl + search;
    for (const templateMapKey in templates) {
      if (templates.hasOwnProperty(templateMapKey)) {
        const isMatch = new RegExp(templateMapKey + '$', 'i').test(query);
        if (isMatch) {
          const toolkitUrl: string = (templates as any)[templateMapKey];
          let { search: componentUrl } = parseSampleUrl(toolkitUrl);
          componentUrl = componentUrl.replace('?id=', '');
          const exampleUrl = `https://mgt.dev/?path=/story/${componentUrl}`;
          validateToolkitUrl(toolkitUrl, 'Graph toolkit link');
          validateToolkitUrl(exampleUrl, 'Graph toolkit example link');
          return {
            exampleUrl: exampleUrl,
            toolkitUrl: toolkitUrl
          };
        }
      }
    }

  }
  return { toolkitUrl: null, exampleUrl: null };
}