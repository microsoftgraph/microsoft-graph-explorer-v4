import { IconButton, IIconProps, Label, PrimaryButton, styled } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { classNames } from '../../../classnames';
import { authStyles } from './Auth.styles';

function handleCopy() {
  const tokenTextArea: any = document.getElementById('access-token');
  tokenTextArea.focus();
  tokenTextArea.select();

  document.execCommand('copy');
  document.execCommand('unselect');

  tokenTextArea.blur();
}

export function Auth(props: any) {
  const accessToken = useSelector((state: any) => state.authToken);

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
        <textarea className={classes.accessToken} id='access-token' value={accessToken} readOnly={true} />
      </div>
      :
      <Label className={classes.emptyStateLabel}>
        <FormattedMessage id='Sign In to see your access token.' />
      </Label>
    }
  </div>);
}

export default styled(Auth, authStyles as any);
