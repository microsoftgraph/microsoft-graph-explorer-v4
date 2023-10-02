import { createContext } from 'react';

interface ValidationContext {
  isValid: boolean;
  validate: (queryUrl: string) => void;
  query: string;
  error: string;
}

export const ValidationContext = createContext<ValidationContext>(
  {} as ValidationContext
);