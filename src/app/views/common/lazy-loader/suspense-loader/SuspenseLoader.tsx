import { Spinner } from '@fluentui/react-components';
import { Suspense } from 'react';
import ErrorBoundary from '../../error-boundary/ErrorBoundary';

interface SuspenseChildren{
  children: React.ReactNode;
}
export const SuspenseLoader = ({ children }: SuspenseChildren) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner size='large' />}>
        {children}
      </Suspense>
    </ErrorBoundary >
  );
}