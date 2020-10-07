import { IconButton, IIconProps, Label, styled } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { telemetry } from '../../../../../telemetry';
import { classNames } from '../../../classnames';
import { genericCopy } from '../../../common/copy';
import { authStyles } from './Auth.styles';


export function Auth(props: any) {
  const accessToken = useSelector((state: any) => state.authToken);

  const handleCopy = async () => {
    await genericCopy(accessToken);
  };

  const classes = classNames(props);
  const copyIcon: IIconProps = {
    iconName: 'copy'
  };

  return (<div className={classes.auth}>
    {accessToken ?
      <div>
        <div className={classes.accessTokenContainer}>
          <Label className={classes.accessTokenLabel}><FormattedMessage id='Access Token' /></Label>
          <IconButton onClick={handleCopy} iconProps={copyIcon} title='Copy' ariaLabel='Copy' />
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
const trackedComponent = telemetry.trackReactComponent(Auth);
export default styled(trackedComponent, authStyles as any);
