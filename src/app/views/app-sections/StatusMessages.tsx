import { MessageBar } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
export function statusMessages(queryState: any, actions: any) {
  return queryState && (
  <MessageBar messageBarType={queryState.messageType}
  isMultiline={false} onDismiss={actions.clearQueryStatus}>
    {`${queryState.statusText} - ${queryState.status} `}
    {queryState.duration && <>
      {`- ${queryState.duration}`}<FormattedMessage id='milliseconds' />
    </>}

    {queryState.status === 403 && <>.
      <FormattedMessage id='consent to scopes' />
      <span style={{ fontWeight: 600 }}>
        <FormattedMessage id='modify permissions' />
      </span>
      <FormattedMessage id='tab' />
    </>}

  </MessageBar>);
}
