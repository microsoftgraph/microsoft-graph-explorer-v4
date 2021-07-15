import { AuthenticationResult } from '@azure/msal-browser';
import { IconButton, IIconProps, Label, MessageBar, MessageBarType, styled } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { authenticationWrapper } from '../../../../../modules/authentication';

import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IRootState } from '../../../../../types/root';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { trackedGenericCopy } from '../../../common/copy';
import { convertVhToPx } from '../../../common/dimensions-adjustment';
import { authStyles } from './Auth.styles';

export function Auth(props: any) {
  const { authToken, dimensions: { request: { height } } } = useSelector((state: IRootState) => state);
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
  }, []);

  const classes = classNames(props);
  const copyIcon: IIconProps = {
    iconName: 'copy'
  };

  const tokenDetailsIcon: IIconProps = {
    iconName: 'code'
  };

  if (!authToken.token) {
    return <MessageBar messageBarType={MessageBarType.blocked}>
      <FormattedMessage id='Sign In to see your access token.' />
    </MessageBar>;
  }

  return (<div className={classes.auth} style={{ height: requestHeight }}>
    {!loading ?
      <div>
        <div className={classes.accessTokenContainer}>
          <Label className={classes.accessTokenLabel}><FormattedMessage id='Access Token' /></Label>
          <IconButton onClick={handleCopy} iconProps={copyIcon} title='Copy' ariaLabel='Copy' />
          <IconButton iconProps={tokenDetailsIcon}
            title={translateMessage('Get token details (Powered by jwt.ms)')}
            ariaLabel={translateMessage('Get token details (Powered by jwt.ms)')}
            href={`https://jwt.ms#access_token=${accessToken}`}
            target='_blank' />
        </div>
        <Label className={classes.accessToken} >{accessToken}</Label>
      </div>
      :
      <Label className={classes.emptyStateLabel}>
        <FormattedMessage id='Getting your access token' /> ...
      </Label>
    }
  </div>);
}

const trackedComponent = telemetry.trackReactComponent(Auth, componentNames.ACCESS_TOKEN_TAB);
// @ts-ignore
export default styled(trackedComponent, authStyles);