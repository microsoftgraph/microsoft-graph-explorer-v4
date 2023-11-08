import { IPermissionProps } from '../../../../../types/permissions';

import LazySpecificPermissions from  '../../../query-runner/request/permissions';
import LazyStatusMessages from  '../../../app-sections/StatusMessages';
import LazyResponseHeaders from  '../../../query-response/headers/ResponseHeaders';
import LazyAdaptiveCard from  '../../../query-response/adaptive-cards/AdaptiveCard';
import LazyGraphToolkit from  '../../../query-response/graph-toolkit/GraphToolkit';
import LazySnippets from  '../../../query-response/snippets/Snippets';
import LazyCopyButton from  '../../copy-button/CopyButton';
import LazyAuth from  '../../../query-runner/request/auth/Auth';
import LazyRequestHeaders from  '../../../query-runner/request/headers/RequestHeaders';
import LazyHistory from  '../../../sidebar/history/History';
import LazyResourceExplorer from  '../../../sidebar/resource-explorer/ResourceExplorer';
import LazyShareQuery from  '../../../query-runner/query-input/share-query/ShareQuery';
import LazyThemeChoser from  '../../../main-header/settings/ThemeChooser';
import LazyPreviewCollection from  '../../../sidebar/resource-explorer/collection/PreviewCollection';
import LazyFullPermissions from  '../../../query-runner/request/permissions/Permissions.Full';

export const Permissions = (props?: IPermissionProps) => {
  return (
    <LazySpecificPermissions {...props} />
  )
}

export const StatusMessages = () => {
  return (
    <LazyStatusMessages />
  )
}

export const AdaptiveCards = (props?: any) => {
  return (
    <LazyAdaptiveCard {...props} />
  )
}

export const GraphToolkit = (props?: any) => {
  return (
    <LazyGraphToolkit {...props} />
  )
}

export const ResponseHeaders = (props?: any) => {
  return (
    <LazyResponseHeaders {...props} />
  )
}

export const Snippets = (props?: any) => {
  return (
    <LazySnippets {...props} />
  )
}

export const CopyButton = (props?: any) => {
  return (
    <LazyCopyButton {...props} />
  )
}

export const Auth = (props?: any) => {
  return (
    <LazyAuth {...props} />
  )
}

export const RequestHeaders = (props?: any) => {
  return (
    <LazyRequestHeaders {...props} />
  )
}

export const History = (props?: any) => {
  return (
    <LazyHistory {...props} />
  )
}

export const ResourceExplorer = (props?: any) => {
  return (
    <LazyResourceExplorer {...props} />
  )
}

export const ShareQuery = (props?: any) => {
  return (
    <LazyShareQuery {...props} />
  )
}

export const ThemeChoser = (props?: any) => {
  return (
    <LazyThemeChoser {...props} />
  )
}

export const PreviewCollection = (props?: any) => {
  return (
    <LazyPreviewCollection {...props} />
  )
}

export const FullPermissions = (props?: any) => {
  return (
    <LazyFullPermissions {...props} />
  )
}

