import { ValidationError } from '../../app/utils/error-utils/ValidationError';
import { sanitizeQueryUrl } from '../../app/utils/query-url-sanitization';
import { getMatchingResourceForUrl } from '../../app/utils/resources/resources-filter';
import { hasPlaceHolders, parseSampleUrl } from '../../app/utils/sample-url-generation';
import { translateMessage } from '../../app/utils/translate-messages';
import { IResource } from '../../types/resources';

class ValidationService {

  private static getResourceValidationError(queryUrl: string, resources: IResource[]): string | null {
    if (resources.length === 0) {
      return null;
    }
    const sanitizedUrl = sanitizeQueryUrl(queryUrl);
    const { requestUrl } = parseSampleUrl(sanitizedUrl);
    const matchingResource = getMatchingResourceForUrl(requestUrl, resources)!;
    if (!matchingResource) {
      return 'No resource found matching this query';
    }
    return null;
  }

  static validate(queryUrl: string, resources: IResource[]): boolean {

    if (!queryUrl) {
      throw new ValidationError(
        `${translateMessage('Missing url')}`,
        'error');
    }

    if (queryUrl.indexOf('graph.microsoft.com') === -1) {
      throw new ValidationError(
        `${translateMessage('The URL must contain graph.microsoft.com')}`,
        'error');
    }

    if (hasPlaceHolders(queryUrl)) {
      throw new ValidationError(
        `${translateMessage('Parts between {} need to be replaced with real values')}`
        , 'warning');
    }

    const resourcesError = ValidationService.getResourceValidationError(queryUrl, resources);
    if (resourcesError) {
      throw new ValidationError(
        `${translateMessage(resourcesError)}`,
        'error');
    }

    return true;
  }
}

export { ValidationService };
