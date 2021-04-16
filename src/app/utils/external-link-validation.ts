import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { errorTypes, telemetry } from '../../telemetry';
import { IQuery } from '../../types/query-runner';
import { sanitizeQueryUrl } from './query-url-sanitization';

export async function validateExternalLink(url: string, componentName: string,
  sampleId: string | null = null, sampleQuery: IQuery | null = null): Promise<void> {
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
      telemetry.trackException(new Error(errorTypes.LINK_ERROR), SeverityLevel.Error, properties);
    });
}

export function isValidHttpsUrl(value: string) {
  let url;

  try {
    url = new URL(value);
  } catch (_) {
    return false;
  }

  return url.protocol === 'https:';
}
