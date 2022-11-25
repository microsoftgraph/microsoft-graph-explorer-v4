import { Spinner, SpinnerSize } from '@fluentui/react';
import { Suspense } from 'react';

interface SuspenseChildren{
  children: React.ReactNode;
}
export const SuspenseLoader = ({ children }: SuspenseChildren) => {
  return (
    <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
      {children}
    </Suspense>
  );
}