import { lazy } from 'react';
import { IPermissionProps } from '../../../../../types/permissions';
import { SuspenseLoader } from '../suspense-loader/SuspenseLoader';

export const Permission = () => {
  const LazyPermission = lazy(() => import('../../../query-runner/request/permissions'));
  return (
    <SuspenseLoader>
      <LazyPermission />
    </SuspenseLoader>
  )
}