import { IPermissionProps } from '../../../../../types/permissions';

// import LazyAdaptiveCard from '../../../query-response/adaptive-cards/AdaptiveCard';
import LazyStatusMessages from '../../../app-sections/StatusMessagesV9';
import LazyGraphToolkit from '../../../query-response/graph-toolkit/GraphToolkit';
import LazyResponseHeaders from '../../../query-response/headers/ResponseHeaders';
import LazyResponseHeadersV9 from '../../../query-response/headers/ResponseHeadersV9';
import LazySnippetsV9 from '../../../query-response/snippets/SnippetsV9';
import LazyAuth from '../../../query-runner/request/auth/AuthV9';
import LazyRequestHeaders from '../../../query-runner/request/headers/RequestHeadersV9';
import LazySpecificPermissions from '../../../query-runner/request/permissions';
import LazyHistory from '../../../sidebar/history/History';
import LazyResourceExplorer from '../../../sidebar/resource-explorer/ResourceExplorer';
import {
  default as LazyCopyButton,
  default as LazyCopyButtonV9
} from '../../copy-button/CopyButtonV9';

export const Permissions = (props?: any) => {
  return <LazySpecificPermissions {...props} />;
};

export const StatusMessages = () => {
  return <LazyStatusMessages />;
};

// export const AdaptiveCards = (props?: any) => {
//   return (
//     <LazyAdaptiveCard {...props} />
//   )
// }

export const GraphToolkit = (props?: any) => {
  return <LazyGraphToolkit {...props} />;
};

export const ResponseHeaders = (props?: any) => {
  return <LazyResponseHeaders {...props} />;
};

export const ResponseHeadersV9 = (props?: any) => {
  return <LazyResponseHeadersV9 {...props} />;
};

export const SnippetsV9 = (props?: any) => {
  return <LazySnippetsV9 {...props} />;
};

export const CopyButton = (props?: any) => {
  return <LazyCopyButton {...props} />;
};

export const CopyButtonV9 = (props?: any) => {
  return <LazyCopyButtonV9 {...props} />;
};

export const Auth = (props?: any) => {
  return <LazyAuth {...props} />;
};

export const RequestHeaders = (props?: any) => {
  return <LazyRequestHeaders {...props} />;
};

export const History = (props?: any) => {
  return <LazyHistory {...props} />;
};

export const ResourceExplorer = (props?: any) => {
  return <LazyResourceExplorer {...props} />;
};
