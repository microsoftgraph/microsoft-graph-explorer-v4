import { ReactNode, useState } from 'react';
import { ValidationService } from '../../../../modules/validation/validation-service';
import { useAppSelector } from '../../../../store';
import { ValidationError } from '../../../utils/error-utils/ValidationError';
import { ValidationContext } from './ValidationContext';

interface ValidationProviderProps {
  children: ReactNode;
}

export const ValidationProvider = ({ children }: ValidationProviderProps) => {
  const [isValid, setIsValid] = useState(false);
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const { resources } = useAppSelector((state) => state);

  const validate = (queryToValidate: string) => {
    setQuery(queryToValidate);
    try {
      ValidationService.validate(queryToValidate, resources.data.children);
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