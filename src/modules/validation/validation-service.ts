import { ValidatedUrl } from './abnf';

interface IValidationService {
  getValidationError(): string | null;
}

class ValidationService implements IValidationService {
  queryUrl: string;

  constructor(queryUrl: string) {
    this.queryUrl = queryUrl;
  }

  private getAbnfValidationError(): string | null {
    try {
      const validator = new ValidatedUrl();
      const validation = validator.validate(this.queryUrl);
      return (!validation.success) ?
        this.queryUrl.substring(validation.matched, validation.maxMatched) : null;
    } catch (error) {
      return null;
    }
  }

  public getValidationError(): string | null {
    const abnfError = this.getAbnfValidationError();
    return abnfError;
  }
}

export { ValidationService }