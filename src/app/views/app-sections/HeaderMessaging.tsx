import { Link, MessageBar, MessageBarType } from '@fluentui/react';

import { getLoginType } from '../../../modules/authentication/authUtils';
import { LoginType } from '../../../types/enums';
import { translateMessage } from '../../utils/translate-messages';

export function headerMessaging(query: string): React.ReactNode {
  const loginType = getLoginType();

  return (
    <div style={{ marginBottom: 8, paddingLeft: 10 }}>
      {loginType === LoginType.Popup && <>
        <MessageBar messageBarType={MessageBarType.info} isMultiline={true}>
          <p>
            <FormattedMessage id='To try the full features' />,
            <Link tabIndex={0} href={query} target='_blank' rel='noopener noreferrer' underline>
              <FormattedMessage id='full Graph Explorer' />.
            </Link>
          </p>
          <p>
            {translateMessage('running the query')}.
          </p>
        </MessageBar>

      </>}
      {loginType === LoginType.Redirect && <MessageBar messageBarType={MessageBarType.warning} isMultiline={true}>
        <p>
          {translateMessage('To try operations other than GET')},

          <Link tabIndex={0} href={query} target='_blank' rel='noopener noreferrer' underline>
            <FormattedMessage id='sign in' />.
          </Link>
        </p>
      </MessageBar>}
    </div>);
}
