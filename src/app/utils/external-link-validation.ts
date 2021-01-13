import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { telemetry } from '../../telemetry';
import { LINK_ERROR } from '../../telemetry/error-types';
import { IQuery } from '../../types/query-runner';
import { sanitizeQueryUrl } from './query-url-sanitization';

export async function validateExternalLink(url: string, componentName: string,
  sampleId: string | null = null,  sampleQuery: IQuery | null = null): Promise<void> {
  await fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
    })
    .catch(error => {
      const properties: { [key: string]: any } = {
        ComponentName: componentName,
        Link: url,
        Message: `${error}`
      };
      if (sampleQuery) {
        const sanitizedUrl = sanitizeQueryUrl(sampleQuery.sampleUrl);
        properties.QuerySignature = `${sampleQuery.selectedVerb} ${sanitizedUrl}`;
      }
      if (sampleId) {
        properties.SampleId = sampleId;
      }
      telemetry.trackException(new Error(LINK_ERROR), SeverityLevel.Error, properties);
    });
}