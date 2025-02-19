import { AuthenticationResult } from '@azure/msal-browser';
import { IconButton, IIconProps, Label, MessageBar, MessageBarType, styled } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { authenticationWrapper } from '../../../../../modules/authentication';
import { useAppSelector } from '../../../../../store';

import { componentNames, telemetry } from '../../../../../telemetry';
import { ACCOUNT_TYPE } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { trackedGenericCopy } from '../../../common/copy';
import { CopyButtonV9 } from '../../../common/lazy-loader/component-registry';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { authStyles } from './Auth.styles';

export function Auth(props: any) {
  const { auth: { authToken }, profile, dimensions: { request: { height } } } = useAppSelector((state) => state);
  const {user} = profile;
  const requestHeight = convertVhToPx(height, 60);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    trackedGenericCopy(accessToken || '', componentNames.ACCESS_TOKEN_COPY_BUTTON);
  };

  useEffect(() => {
    setLoading(true);
    authenticationWrapper.getToken().then((response: AuthenticationResult) => {
      setAccessToken(response.accessToken);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [authToken]);

  const classes = classNames(props);

  const tokenDetailsIcon: IIconProps = {
    iconName: 'code'
  };

  if (!authToken.token) {
    return <MessageBar messageBarType={MessageBarType.blocked}>
      {translateMessage('Sign In to see your access token.')}
    </MessageBar>;
  }

  const tokenDetailsDisabled = user?.profileType === ACCOUNT_TYPE.MSA;

  return (<div className={classes.auth} style={{ height: requestHeight }}>
    {!loading ?
      <div>
        <div className={classes.accessTokenContainer}>
          <Label className={classes.accessTokenLabel}>{translateMessage('Access Token')}</Label>
          <CopyButtonV9 isIconButton={true} handleOnClick={handleCopy} />
          <IconButton iconProps={tokenDetailsIcon}
            title={translateMessage(showMessage())}
            ariaLabel={translateMessage(showMessage())}
            href={`https://jwt.ms#access_token=${accessToken}`}
            disabled={tokenDetailsDisabled}
            target='_blank'
          />
        </div>
        <Label className={classes.accessToken} id='access-tokens-tab' tabIndex={0}>{accessToken}</Label>
      </div>
      :
      <Label className={classes.emptyStateLabel}>
        {translateMessage('Getting your access token')} ...
      </Label>
    }
  </div>);

  function showMessage(): string {
    if (tokenDetailsDisabled) {
      return 'This token is not a jwt token and cannot be decoded by jwt.ms'
    }
    return 'Get token details (Powered by jwt.ms)';
  }
}

const trackedComponent = telemetry.trackReactComponent(Auth, componentNames.ACCESS_TOKEN_TAB);
// @ts-ignore
export default styled(trackedComponent, authStyles);