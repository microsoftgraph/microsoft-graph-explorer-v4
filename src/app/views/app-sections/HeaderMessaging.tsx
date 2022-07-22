import { Link, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getLoginType } from '../../../modules/authentication/authUtils';
import { LoginType } from '../../../types/enums';

export function headerMessaging(query: string): React.ReactNode {
  const loginType = getLoginType();

  return (
    <div style={{ marginBottom: 8, paddingLeft: 10 }}>
      {loginType === LoginType.Popup && <>
        <MessageBar messageBarType={MessageBarType.info} isMultiline={true}>
          <p>
            <FormattedMessage id='To try the full features' />,
            <Link tabIndex={0} href={query} target='_blank' rel='noopener noreferrer'>
              <FormattedMessage id='full Graph Explorer' />.
            </Link>
          </p>
          <p>
            <FormattedMessage id='running the query' />.
          </p>
        </MessageBar>

      </>}
      {loginType === LoginType.Redirect && <MessageBar messageBarType={MessageBarType.warning} isMultiline={true}>
        <p>
          <FormattedMessage id='To try operations other than GET' />,

          <Link tabIndex={0} href={query} target='_blank' rel='noopener noreferrer'>
            <FormattedMessage id='sign in' />.
          </Link>
        </p>
      </MessageBar>}
    </div>);
}
