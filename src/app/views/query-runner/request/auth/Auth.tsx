import { IconButton, IIconProps, Label, styled } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { telemetry } from '../../../../../telemetry';
import { BUTTON_CLICK_EVENT } from '../../../../../telemetry/event-types';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { genericCopy } from '../../../common/copy';
import { authStyles } from './Auth.styles';


export function Auth(props: any) {
  const accessToken = useSelector((state: any) => state.authToken);

  const handleCopy = async () => {
    await genericCopy(accessToken);
    trackCopyEvent();
  };

  const classes = classNames(props);
  const copyIcon: IIconProps = {
    iconName: 'copy'
  };

  const tokenDetailsIcon: IIconProps = {
    iconName: 'code'
  };

  return (<div className={classes.auth}>
    {accessToken ?
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
        <FormattedMessage id='Sign In to see your access token.' />
      </Label>
    }
  </div>);
}

function trackCopyEvent() {
  telemetry.trackEvent(
    BUTTON_CLICK_EVENT,
    {
      ComponentName: 'Access token copy button'
    });
}

export default styled(Auth, authStyles as any);
