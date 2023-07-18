/* eslint-disable max-len */
import { lazy } from 'react';
import { IPermissionProps } from '../../../../../types/permissions';
import { SuspenseLoader } from '../suspense-loader/SuspenseLoader';

const LazyPermission = lazy(() =>
/* webpackChunkName: "permissions" */ import('../../../query-runner/request/permissions'));
const LazyStatusMessages = lazy( () =>
/* webpackChunkName: "statusMessages" */ import('../../../app-sections/StatusMessages'));
const LazyResponseHeaders = lazy(() =>
/* webpackChunkName: "responseHeaders" */import('../../../query-response/headers/ResponseHeaders'));
const LazyAdaptiveCard = lazy(() =>
/* webpackChunkName: "adaptiveCards" */import('../../../query-response/adaptive-cards/AdaptiveCard'));
const LazyGraphToolkit = lazy(() =>
/* webpackChunkName: "graphToolkit" */import('../../../query-response/graph-toolkit/GraphToolkit'));
const LazySnippets = lazy(() =>
/* webpackChunkName: "code snippets" */import('../../../query-response/snippets/Snippets').then(module => {
    return { default: module.Snippets }
  }));

const LazyCopyButton = lazy(() =>
/* webpackChunkName: "copy button" */import('../../copy-button/CopyButton').then(module => {
    return { default: module.CopyButton }
  }));

const LazyAuth = lazy(() =>
/* webpackChunkName: "authTab" */import('../../../query-runner/request/auth/Auth'));
const LazyRequestHeaders = lazy(() =>
/* webpackChunkName: "requestHeaders" */import('../../../query-runner/request/headers/RequestHeaders'));
const LazyHistory = lazy(() =>
/* webpackChunkName: "history" */import('../../../sidebar/history/History'));
const LazyResourceExplorer = lazy(() =>
/* webpackChunkName: "resourceExplorer" */import('../../../sidebar/resource-explorer/ResourceExplorer'));

export const popups = new Map<string, any>([
  ['share-query', lazy(() =>
  /* webpackChunkName: "share query" */ import('../../../query-runner/query-input/share-query/ShareQuery'))],
  ['theme-chooser', lazy(() =>
  /* webpackChunkName: "theme chooser" */ import('../../../main-header/settings/ThemeChooser'))],
  ['preview-collection', lazy(() =>
  /* webpackChunkName: "preview collection" */ import('../../../sidebar/resource-explorer/collection/PreviewCollection'))],
  ['full-permissions', lazy(() =>
  /* webpackChunkName: "full permissions" */ import('../../../query-runner/request/permissions/Permissions.Full'))]
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

