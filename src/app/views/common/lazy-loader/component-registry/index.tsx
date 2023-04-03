import { lazy } from 'react';
import { IPermissionProps } from '../../../../../types/permissions';
import { SuspenseLoader } from '../suspense-loader/SuspenseLoader';

const LazyPermission = lazy(() => import('../../../query-runner/request/permissions'));
const LazyStatusMessages = lazy( () => import('../../../app-sections/StatusMessages'));
const LazyResponseHeaders = lazy(() => import('../../../query-response/headers/ResponseHeaders'));
const LazyFeedbackForm = lazy( () => import('../../../query-runner/request/feedback/FeedbackForm'));
const LazyAdaptiveCard = lazy(() => import('../../../query-response/adaptive-cards/AdaptiveCard'));
const LazyGraphToolkit = lazy(() => import('../../../query-response/graph-toolkit/GraphToolkit'));
const LazySnippets = lazy(() => import('../../../query-response/snippets/Snippets').then(module => {
  return { default: module.Snippets }
}));

const LazyCopyButton = lazy(() => import('../../copy-button/CopyButton').then(module => {
  return { default: module.CopyButton }
}));

const LazyAuth = lazy(() => import('../../../query-runner/request/auth/Auth'));
const LazyRequestHeaders = lazy(() => import('../../../query-runner/request/headers/RequestHeaders'));
const LazyHistory = lazy(() => import('../../../sidebar/history/History'));
const LazyResourceExplorer = lazy(() => import('../../../sidebar/resource-explorer/ResourceExplorer'));

export const Permission = (props?: IPermissionProps) => {
  return (
    <SuspenseLoader>
      <LazyPermission {...props} />
    </SuspenseLoader>
  )
}

export const StatusMessages = () => {
  return (
    <SuspenseLoader>
      <LazyStatusMessages />
    </SuspenseLoader>
  )
}

export const FeedbackForm = (props: any) => {
  return (
    <SuspenseLoader>
      <LazyFeedbackForm {...props} />
    </SuspenseLoader>
  )
}

export const AdaptiveCards = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyAdaptiveCard {...props} />
    </SuspenseLoader>
  )
}

export const GraphToolkit = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyGraphToolkit {...props} />
    </SuspenseLoader>
  )
}

export const ResponseHeaders = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyResponseHeaders {...props} />
    </SuspenseLoader>
  )
}

export const Snippets = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazySnippets {...props} />
    </SuspenseLoader>
  )
}

export const CopyButton = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyCopyButton {...props} />
    </SuspenseLoader>
  )
}

export const Auth = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyAuth {...props} />
    </SuspenseLoader>
  )
}

export const RequstHeaders = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyRequestHeaders {...props} />
    </SuspenseLoader>
  )
}

export const History = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyHistory {...props} />
    </SuspenseLoader>
  )
}

export const ResourceExplorer = (props?: any) => {
  return (
    <SuspenseLoader>
      <LazyResourceExplorer {...props} />
    </SuspenseLoader>
  )
}

