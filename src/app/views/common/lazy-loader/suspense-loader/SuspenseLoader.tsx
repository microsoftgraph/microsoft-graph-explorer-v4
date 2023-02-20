import { Spinner, SpinnerSize } from '@fluentui/react';
import { Suspense } from 'react';
import ErrorBoundary from '../../error-boundary/ErrorBoundary';

interface SuspenseChildren{
  children: React.ReactNode;
}
export const SuspenseLoader = ({ children }: SuspenseChildren) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
        {children}
      </Suspense>
    </ErrorBoundary >
  );
}