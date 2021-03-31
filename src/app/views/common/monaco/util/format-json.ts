import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { componentNames, errorTypes, telemetry } from '../../../../../telemetry';

export function formatJsonStringForAllBrowsers(body: string | object | undefined) {
  /**
   * 1. Remove whitespace, tabs or raw string (Safari related issue)
   * 2. Convert back to javascript object
   * 3. format the string (works for all browsers)
   */
  try {
    body = JSON.stringify(body).replace(/(?:\\[rnt]|[\r\n\t]+)+/g, '');
    body = JSON.parse(body);
  } catch (error) {
    telemetry.trackException(
      new Error(errorTypes.OPERATIONAL_ERROR),
      SeverityLevel.Error,
      {
        ComponentName: componentNames.MONACO_EDITOR,
        Message: `${error}`
      }
    );
  }
  return JSON.stringify(body, null, 4);
}
