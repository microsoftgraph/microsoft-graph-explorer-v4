import { AuthenticationResult } from '@azure/msal-browser';
import {
  Button,
  makeStyles,
  MessageBar,
  Text,
  Tooltip
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { authenticationWrapper } from '../../../../../modules/authentication';
import { useAppSelector } from '../../../../../store';

import { BracesRegular } from '@fluentui/react-icons';
import { componentNames, telemetry } from '../../../../../telemetry';
import { ACCOUNT_TYPE } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { trackedGenericCopy } from '../../../common/copy';
import { CopyButton } from '../../../common/lazy-loader/component-registry';

const useStyles = makeStyles({
  auth: {
    padding: '5px',
    overflowY: 'auto'
  },
  accessTokenContainer: {
    width: '160px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px'
  },
  accessToken: {
    display: 'inline-block',
    wordBreak: 'break-all'
  },
  emptyStateLabel: {
    display: 'flex',
    width: '100%',
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export function Auth() {
  const profile = useAppSelector((state) => state.profile);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const { user } = profile;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const styles = useStyles();

  const handleCopy = async () => {
    trackedGenericCopy(
      accessToken || '',
      componentNames.ACCESS_TOKEN_COPY_BUTTON
    );
  };

  useEffect(() => {
    setLoading(true);
    authenticationWrapper
      .getToken()
      .then((response: AuthenticationResult) => {
        setAccessToken(response.accessToken);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [authToken]);

  const tokenDetailsDisabled = user?.profileType === ACCOUNT_TYPE.MSA;

  if (!authToken.token) {
    return (
      <MessageBar intent='error'>
        {translateMessage('Sign In to see your access token.')}
      </MessageBar>
    );
  }

  return (
    <div id='styles-auth' className={styles.auth}>
      {!loading ? (
        <div>
          <div className={styles.accessTokenContainer}>
            <Text weight='bold'>{translateMessage('Access Token')}</Text>
            <CopyButton isIconButton={true} handleOnClick={handleCopy} />
            <Tooltip
              content={translateMessage(showMessage())}
              relationship='label'
            >
              <Button
                as='a'
                href={`https://jwt.ms#access_token=${accessToken}`}
                target='_blank'
                appearance='subtle'
                disabled={tokenDetailsDisabled}
                icon={<BracesRegular />}
              />
            </Tooltip>
          </div>
          <div id='access-token' className={styles.accessToken}>
            <Text font='monospace' tabIndex={0}>
              {accessToken}
            </Text>
          </div>
        </div>
      ) : (
        <MessageBar intent='info'>
          {translateMessage('Getting your access token')} ...
        </MessageBar>
      )}
    </div>
  );

  function showMessage(): string {
    if (tokenDetailsDisabled) {
      return 'This token is not a JWT token and cannot be decoded by jwt.ms';
    }
    return 'Get token details (Powered by jwt.ms)';
  }
}

export default telemetry.trackReactComponent(
  Auth,
  componentNames.ACCESS_TOKEN_TAB
);
