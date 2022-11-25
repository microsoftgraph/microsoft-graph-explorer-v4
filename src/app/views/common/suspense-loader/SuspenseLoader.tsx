import { Spinner, SpinnerSize } from '@fluentui/react';
import React, { Suspense } from 'react';

interface SuspenseChildren{
  children: React.ReactNode;
}
export const SuspenseLoader = ({ children }: SuspenseChildren) => {
  return (
    <Suspense fallback={<Spinner size={SpinnerSize.large} />}>
      <div>
        {children}
      </div>
    </Suspense>
  );
}