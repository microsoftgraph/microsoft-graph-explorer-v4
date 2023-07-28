/* eslint-disable max-len */
import { lazy } from 'react';
import { IPermissionProps } from '../../../../../types/permissions';
import { SuspenseLoader } from '../suspense-loader/SuspenseLoader';

const LazyPermission = lazy(() =>
  import(/* webpackChunkName: "permissions" */ '../../../query-runner/request/permissions'));
const LazyStatusMessages = lazy( () =>
  import(/* webpackChunkName: "statusMessages" */ '../../../app-sections/StatusMessages'));
const LazyResponseHeaders = lazy(() =>
  import(/* webpackChunkName: "responseHeaders" */ '../../../query-response/headers/ResponseHeaders'));
const LazyAdaptiveCard = lazy(() =>
  import(/* webpackChunkName: "adaptiveCards" */ '../../../query-response/adaptive-cards/AdaptiveCard'));
const LazyGraphToolkit = lazy(() =>
  import(/* webpackChunkName: "graphToolkit" */ '../../../query-response/graph-toolkit/GraphToolkit'));
const LazySnippets = lazy(() =>
  import(/* webpackChunkName: "code snippets" */ '../../../query-response/snippets/Snippets'));
const LazyCopyButton = lazy(() =>
  import(/* webpackChunkName: "copy button" */ '../../copy-button/CopyButton'));
const LazyAuth = lazy(() =>
  import(/* webpackChunkName: "authTab" */ '../../../query-runner/request/auth/Auth'));
const LazyRequestHeaders = lazy(() =>
  import(/* webpackChunkName: "requestHeaders" */ '../../../query-runner/request/headers/RequestHeaders'));
const LazyHistory = lazy(() =>
  import(/* webpackChunkName: "history" */ '../../../sidebar/history/History'));
const LazyResourceExplorer = lazy(() =>
  import(/* webpackChunkName: "resourceExplorer" */ '../../../sidebar/resource-explorer/ResourceExplorer'));

export const popups = new Map<string, any>([
  ['share-query', lazy(() =>
    import(/* webpackChunkName: "share query" */ '../../../query-runner/query-input/share-query/ShareQuery'))],
  ['theme-chooser', lazy(() =>
    import(/* webpackChunkName: "theme chooser" */ '../../../main-header/settings/ThemeChooser'))],
  ['preview-collection', lazy(() =>
    import(/* webpackChunkName: "preview collection" */ '../../../sidebar/resource-explorer/collection/PreviewCollection'))],
  ['full-permissions', lazy(() =>
    import(/* webpackChunkName: "full permissions" */ '../../../query-runner/request/permissions/Permissions.Full'))]
]);

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

