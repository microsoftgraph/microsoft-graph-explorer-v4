import { lazy } from 'react';
import { IPermissionProps } from '../../../../../types/permissions';
import { SuspenseLoader } from '../suspense-loader/SuspenseLoader';

const Permission = lazy(() => import('../../../query-runner/request/permissions'));
const StatusMessages = lazy( () => import('../../../app-sections/StatusMessages'));
const ResponseHeaders = lazy(() => import('../../../query-response/headers/ResponseHeaders'));
const FeedbackForm = lazy( () => import('../../../query-runner/request/feedback/FeedbackForm'));
const AdaptiveCard = lazy(() => import('../../../query-response/adaptive-cards/AdaptiveCard'));
const GraphToolkit = lazy(() => import('../../../query-response/graph-toolkit/GraphToolkit'));
const Snippets = lazy(() => import('../../../query-response/snippets/Snippets').then(module => {
  return { default: module.Snippets }
}));

const CopyButton = lazy(() => import('../../copy-button/CopyButton').then(module => {
  return { default: module.CopyButton }
}));

const Auth = lazy(() => import('../../../query-runner/request/auth/Auth'));
const RequestHeaders = lazy(() => import('../../../query-runner/request/headers/RequestHeaders'));
const History = lazy(() => import('../../../sidebar/history/History'));
const ResourceExplorer = lazy(() => import('../../../sidebar/resource-explorer/ResourceExplorer'));

export const LazyPermission = (props?: IPermissionProps) => {
  return (
    <SuspenseLoader>
      <Permission {...props} />
    </SuspenseLoader>
  )
}

export const LazyStatusMessages = () => {
  return (
    <SuspenseLoader>
      <StatusMessages />
    </SuspenseLoader>
  )
}

export const LazyFeedbackForm = (props: any) => {
  return (
    <SuspenseLoader>
      <FeedbackForm {...props} />
    </SuspenseLoader>
  )
}

export const LazyAdaptiveCards = (props?: any) => {
  return (
    <SuspenseLoader>
      <AdaptiveCard {...props} />
    </SuspenseLoader>
  )
}

export const LazyGraphToolkit = (props?: any) => {
  return (
    <SuspenseLoader>
      <GraphToolkit {...props} />
    </SuspenseLoader>
  )
}

export const LazyResponseHeaders = (props?: any) => {
  return (
    <SuspenseLoader>
      <ResponseHeaders {...props} />
    </SuspenseLoader>
  )
}

export const LazySnippets = (props?: any) => {
  return (
    <SuspenseLoader>
      <Snippets {...props} />
    </SuspenseLoader>
  )
}

export const LazyCopyButton = (props?: any) => {

  return (
    <SuspenseLoader>
      <CopyButton {...props} />
    </SuspenseLoader>
  )
}

export const LazyAuth = (props?: any) => {

  return (
    <SuspenseLoader>
      <Auth {...props} />
    </SuspenseLoader>
  )
}

export const LazyRequstHeaders = (props?: any) => {

  return (
    <SuspenseLoader>
      <RequestHeaders {...props} />
    </SuspenseLoader>
  )
}

export const LazyHistory = (props?: any) => {

  return (
    <SuspenseLoader>
      <History {...props} />
    </SuspenseLoader>
  )
}

export const LazyResourceExplorer = (props?: any) => {
  return (
    <SuspenseLoader>
      <ResourceExplorer {...props} />
    </SuspenseLoader>
  )
}

