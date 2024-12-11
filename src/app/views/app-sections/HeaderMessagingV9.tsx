import { Link, MessageBar, MessageBarBody, makeStyles} from '@fluentui/react-components';

import { getLoginType } from '../../../modules/authentication/authUtils';
import { LoginType } from '../../../types/enums';
import { translateMessage } from '../../utils/translate-messages';

const useHeaderStyles = makeStyles({
  root: {
    marginBottom: '8',
    paddingLeft: '10'
  }
});

export const headerMessagingV9 = (query: string): React.ReactNode => {
  const loginType = getLoginType();
  const headerStyles = useHeaderStyles();

  return (
    <div className={headerStyles.root}>
      {loginType === LoginType.Popup &&
        <MessageBar intent={'info'}>
          <MessageBarBody>
            {translateMessage('To try the full features')},
            <Link
              tabIndex={0}
              inline
              href={query}
              target='_blank' rel='noopener noreferrer'>
              {translateMessage('full Graph Explorer')}.
            </Link>
            {translateMessage('running the query')}.
          </MessageBarBody>
        </MessageBar>
      }
      {loginType === LoginType.Redirect && <MessageBar intent={'warning'}>
        <MessageBarBody>
          {translateMessage('To try operations other than GET')},
          <Link
            tabIndex={0}
            href={query}
            target='_blank'
            rel='noopener noreferrer'
            inline>
            {translateMessage('sign in')}.
          </Link>
        </MessageBarBody>
      </MessageBar>}
    </div>);
}
