import { ValidationError } from '../../app/utils/error-utils/ValidationError';
import { hasPlaceHolders } from '../../app/utils/sample-url-generation';
import { translateMessage } from '../../app/utils/translate-messages';
import { ValidatedUrl } from './abnf';

class ValidationService {

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

  static validate(queryUrl: string): boolean {

    if (!queryUrl) {
      throw new ValidationError(`${translateMessage('Missing url')}`);
    }

    if (queryUrl.indexOf('graph.microsoft.com') === -1) {
      throw new ValidationError(`${translateMessage('The URL must contain graph.microsoft.com')}`);
    }

    if (hasPlaceHolders(queryUrl)) {
      throw new ValidationError(`${translateMessage('Parts between {} need to be replaced with real values')}`);
    }

    const abnfError = ValidationService.getAbnfValidationError(queryUrl);
    if (abnfError) {
      throw new ValidationError(`${translateMessage('Possible error found in URL near')}: ${abnfError}`);
    }
    return true;
  }
}

export { ValidationService };
