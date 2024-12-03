import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ValidationService } from '../../../../modules/validation/validation-service';
import { useAppSelector } from '../../../../store';
import { IResource } from '../../../../types/resources';
import { ValidationError } from '../../../utils/error-utils/ValidationError';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { GRAPH_API_VERSIONS } from '../../graph-constants';
import { ValidationContext } from './ValidationContext';

interface ValidationProviderProps {
  children: ReactNode;
}

export const ValidationProvider = ({ children }: ValidationProviderProps) => {
  const resources = useAppSelector((state) => state.resources);
  const base = Object.keys(resources.data).length > 0 ?
    resources.data[GRAPH_API_VERSIONS[0]].children! : [];

  const [isValid, setIsValid] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const [versionedResources, setVersionedResources] =
    useState<IResource[]>(base && base.length > 0 ? base : []);
  const [version, setVersion] = useState<string>(GRAPH_API_VERSIONS[0]);

  const { queryVersion } = parseSampleUrl(query);

  useEffect(() => {
    if (Object.keys(resources.data).length > 0 && resources.data[GRAPH_API_VERSIONS[0]].children!.length > 0) {
      setVersionedResources(resources.data[GRAPH_API_VERSIONS[0]].children!);
    }
  }, [resources])

  useEffect(() => {
    if (!queryVersion || !query || Object.keys(resources.data).length === 0) {
      return;
    }
    if (version !== queryVersion && GRAPH_API_VERSIONS.includes(queryVersion)
      && resources.data[queryVersion].children!.length > 0) {
      setVersionedResources(resources.data[queryVersion].children!);
      setVersion(queryVersion);
    }
  }, [query]);

  const validate = (queryToValidate: string) => {
    setQuery(queryToValidate);
    try {
      ValidationService.validate(queryToValidate, versionedResources);
      setIsValid(true);
      setValidationError('');
    } catch (error: unknown) {
      const theError = error as ValidationError;
      setValidationError(theError.message);
      setIsValid(theError.type === 'warning');
    }
  };

  const contextValue = useMemo(() => {
    return { isValid, validate, query, error: validationError };
  }, [isValid, validate, query, validationError]);

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );

};