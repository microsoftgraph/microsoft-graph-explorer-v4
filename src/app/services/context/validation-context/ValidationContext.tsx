import { createContext } from 'react';

interface ValidationContext {
  isValid: boolean;
  validate: (queryUrl: string) => boolean;
  query: string;
  error: string;
}

export const ValidationContext = createContext<ValidationContext>(
  {} as ValidationContext
);