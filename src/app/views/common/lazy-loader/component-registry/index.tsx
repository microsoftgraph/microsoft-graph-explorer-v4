import { IPermissionProps } from '../../../../../types/permissions';

import LazyStatusMessages from '../../../app-sections/StatusMessages';
import LazyAdaptiveCard from '../../../query-response/adaptive-cards/AdaptiveCard';
import LazyGraphToolkit from '../../../query-response/graph-toolkit/GraphToolkit';
import LazyResponseHeaders from '../../../query-response/headers/ResponseHeaders';
import LazyResponseHeadersV9 from '../../../query-response/headers/ResponseHeadersV9';
import LazySnippets from '../../../query-response/snippets/Snippets';
import LazyAuth from '../../../query-runner/request/auth/Auth';
import LazyRequestHeaders from '../../../query-runner/request/headers/RequestHeaders';
import LazySpecificPermissions from '../../../query-runner/request/permissions';
import LazyHistory from '../../../sidebar/history/History';
import LazyResourceExplorer from '../../../sidebar/resource-explorer/ResourceExplorer';
import LazyCopyButton from '../../copy-button/CopyButton';
import LazyCopyButtonV9 from '../../copy-button/CopyButtonV9';

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

export const ResponseHeadersV9 = (props?: any) => {
  return (
    <LazyResponseHeadersV9 {...props} />
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

export const CopyButtonV9 = (props?: any) => {
  return (
    <LazyCopyButtonV9 {...props} />
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