import { lazy } from 'react';
import { IPermissionProps } from '../../../../../types/permissions';
import { SuspenseLoader } from '../suspense-loader/SuspenseLoader';

export const LazyPermission = (props?: IPermissionProps) => {
  const Permission = lazy(() => import('../../../query-runner/request/permissions'));
  return (
    <SuspenseLoader>
      <Permission {...props} />
    </SuspenseLoader>
  )
}

export const LazyStatusMessages = () => {
  const StatusMessages = lazy( () => import('../../../app-sections/StatusMessages'));
  return (
    <SuspenseLoader>
      <StatusMessages />
    </SuspenseLoader>
  )
}

export const LazyFeedbackForm = (props: any) => {
  const FeedbackForm = lazy( () => import('../../../query-runner/request/feedback/FeedbackForm'));
  return (
    <SuspenseLoader>
      <FeedbackForm {...props} />
    </SuspenseLoader>
  )
}

export const LazyAdaptiveCards = (props?: any) => {
  const AdaptiveCard = lazy(() => import('../../../query-response/adaptive-cards/AdaptiveCard'));
  return (
    <SuspenseLoader>
      <AdaptiveCard {...props} />
    </SuspenseLoader>
  )
}

export const LazyGraphToolkit = (props?: any) => {
  const GraphToolkit = lazy(() => import('../../../query-response/graph-toolkit/GraphToolkit'));
  return (
    <SuspenseLoader>
      <GraphToolkit {...props} />
    </SuspenseLoader>
  )
}

export const LazyResponseHeaders = (props?: any) => {
  const ResponseHeaders = lazy(() => import('../../../query-response/headers/ResponseHeaders'));
  return (
    <SuspenseLoader>
      <ResponseHeaders {...props} />
    </SuspenseLoader>
  )
}

export const LazySnippets = (props?: any) => {
  const Snippets = lazy(() => import('../../../query-response/snippets/Snippets').then( module => {
    return { default: module.Snippets}
  }));
  return (
    <SuspenseLoader>
      <Snippets {...props} />
    </SuspenseLoader>
  )
}

export const LazyCopyButton = (props?: any) => {
  const CopyButton = lazy(() => import('../../../common/copy-button/CopyButton').then( module => {
    return { default: module.CopyButton}}));
  return (
    <SuspenseLoader>
      <CopyButton {...props} />
    </SuspenseLoader>
  )
}

export const LazyAuth = (props?: any) => {
  const Auth = lazy(() => import('../../../query-runner/request/auth/Auth'));
  return (
    <SuspenseLoader>
      <Auth {...props} />
    </SuspenseLoader>
  )
}

export const LazyRequstHeaders = (props?: any) => {
  const RequestHeaders = lazy(() => import('../../../query-runner/request/headers/RequestHeaders'));
  return (
    <SuspenseLoader>
      <RequestHeaders {...props} />
    </SuspenseLoader>
  )
}

export const LazyHistory = (props?: any) => {
  const History = lazy(() => import('../../../sidebar/history/History'));
  return (
    <SuspenseLoader>
      <History {...props} />
    </SuspenseLoader>
  )
}

export const LazyResourceExplorer = (props?: any) => {
  const ResourceExplorer = lazy(() => import('../../../sidebar/resource-explorer/ResourceExplorer'));
  return (
    <SuspenseLoader>
      <ResourceExplorer {...props} />
    </SuspenseLoader>
  )
}