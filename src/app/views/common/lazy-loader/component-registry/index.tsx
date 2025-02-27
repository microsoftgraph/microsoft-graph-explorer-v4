import LazySnippets from '../../../query-response/snippets/Snippets';
import LazySpecificPermissions from  '../../../query-runner/request/permissions';
import LazyStatusMessages from  '../../../app-sections/StatusMessages';
import LazyResponseHeaders from  '../../../query-response/headers/ResponseHeaders';
import LazyGraphToolkit from  '../../../query-response/graph-toolkit/GraphToolkit';
import LazyCopyButton from  '../../copy-button/CopyButton';
import LazyAuth from  '../../../query-runner/request/auth/Auth';
import LazyRequestHeaders from  '../../../query-runner/request/headers/RequestHeaders';
import LazyHistory from  '../../../sidebar/history/History';
import LazyResourceExplorer from  '../../../sidebar/resource-explorer/ResourceExplorer';

export const Permissions = (props?: any) => {
  return <LazySpecificPermissions {...props} />;
};

export const StatusMessages = () => {
  return <LazyStatusMessages />;
};

export const GraphToolkit = (props?: any) => {
  return <LazyGraphToolkit {...props} />;
};

export const ResponseHeaders = (props?: any) => {
  return <LazyResponseHeaders {...props} />;
};

export const Snippets = (props?: any) => {
  return <LazySnippets {...props} />;
};

export const CopyButton = (props?: any) => {
  return <LazyCopyButton {...props} />;
};

export const Auth = (props?: any) => {
  return LazyAuth ? <LazyAuth {...props} /> : null;
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
