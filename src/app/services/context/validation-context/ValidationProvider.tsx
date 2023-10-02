import { useState, ReactNode } from 'react';
import { ValidationContext } from './ValidationContext';
import { ValidationService } from '../../../../modules/validation/validation-service';
import { ValidationError } from '../../../utils/error-utils/ValidationError';

interface ValidationProviderProps {
  children: ReactNode;
}

export const ValidationProvider = ({ children }: ValidationProviderProps) => {
  const [isValid, setIsValid] = useState(false);
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = (queryToValidate: string) => {
    setQuery(queryToValidate);
    try {
      ValidationService.validate(queryToValidate);
      setIsValid(true);
      setValidationError('');
    } catch (error: unknown) {
      const theError = error as ValidationError;
      setValidationError(theError.message);
      setIsValid(theError.type === 'warning');
    }
  };

  return (
    <ValidationContext.Provider
      value={{ isValid, validate, query, error: validationError }}
    >
      {children}
    </ValidationContext.Provider>
  );
};