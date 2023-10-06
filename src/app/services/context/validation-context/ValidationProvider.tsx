import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ValidationService } from '../../../../modules/validation/validation-service';
import { useAppSelector } from '../../../../store';
import { IResource } from '../../../../types/resources';
import { ValidationError } from '../../../utils/error-utils/ValidationError';
import { getResourcesSupportedByVersion } from '../../../utils/resources/resources-filter';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { GRAPH_API_VERSIONS } from '../../graph-constants';
import { ValidationContext } from './ValidationContext';

interface ValidationProviderProps {
  children: ReactNode;
}

export const ValidationProvider = ({ children }: ValidationProviderProps) => {
  const { resources } = useAppSelector((state) => state);
  const base = getResourcesSupportedByVersion(resources.data.children, GRAPH_API_VERSIONS[0]);

  const [isValid, setIsValid] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const [versionedResources, setVersionedResources] =
  useState<IResource[]>(resources.data.children.length > 0 ? base : []);
  const [version, setVersion] = useState<string>(GRAPH_API_VERSIONS[0]);

  const { queryVersion } = parseSampleUrl(query);

  useEffect(() => {
    if (resources.data.children.length > 0) {
      setVersionedResources(getResourcesSupportedByVersion(resources.data.children, GRAPH_API_VERSIONS[0]));
    }
  }, [resources])

  useEffect(() => {
    if (version !== queryVersion && GRAPH_API_VERSIONS.includes(queryVersion) && resources.data.children.length > 0) {
      setVersionedResources(getResourcesSupportedByVersion(resources.data.children, queryVersion));
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