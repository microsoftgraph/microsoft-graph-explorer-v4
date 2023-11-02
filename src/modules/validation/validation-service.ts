import { ValidationError } from '../../app/utils/error-utils/ValidationError';
import { sanitizeQueryUrl } from '../../app/utils/query-url-sanitization';
import { getMatchingResourceForUrl } from '../../app/utils/resources/resources-filter';
import { hasPlaceHolders, isValidHostname, parseSampleUrl } from '../../app/utils/sample-url-generation';
import { translateMessage } from '../../app/utils/translate-messages';
import { IResource } from '../../types/resources';
import { ValidatedUrl } from './abnf';

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

  private static getAbnfValidationError(queryUrl: string): string | null {
    try {
      const validator = new ValidatedUrl();
      const validation = validator.validate(queryUrl);
      return (!validation.success) ?
        queryUrl.substring(validation.matched, validation.maxMatched) : null;
    } catch (error) {
      return null;
    }
  }

  static validate(queryUrl: string, resources: IResource[]): boolean {

    if (!queryUrl) {
      throw new ValidationError(
        `${translateMessage('Missing url')}`,
        'error');
    }

    const { hostname } = new URL(queryUrl);
    if (!isValidHostname(hostname)) {
      throw new ValidationError(
        `${translateMessage('The URL must contain graph.microsoft.com')}`,
        'error');
    }

    const { queryVersion } = parseSampleUrl(queryUrl);
    if (!queryVersion) {
      throw new ValidationError(
        `${translateMessage('Missing version')}`,
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
        'warning');
    }

    const abnfError = ValidationService.getAbnfValidationError(queryUrl);
    if (abnfError) {
      throw new ValidationError(
        `${translateMessage('Possible error found in URL near')}: ${abnfError}`,
        'warning');
    }

    return true;
  }
}

export { ValidationService };

