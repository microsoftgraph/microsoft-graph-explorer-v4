import { ValidatedUrl } from './abnf';

function getValidationError(queryUrl: string): string | null {
  try {
    const validator = new ValidatedUrl();
    const validation = validator.validate(queryUrl);
    return (!validation.success) ?
      queryUrl.substring(validation.matched, validation.maxMatched) : null;
  } catch (error) {
    return null;
  }
}

export { getValidationError };
