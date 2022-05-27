import { ActionButton, getTheme } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { translateMessage } from '../../../utils/translate-messages';
import Profile from '../profile/Profile';
import { utilComponentStyles } from './UtilComponents.styles';

export function showSignInButtonOrProfile(
  tokenPresent: boolean,
  mobileScreen: boolean,
  signIn: Function
) {

  const currentTheme = getTheme();
  const { actionButtonStyles } = utilComponentStyles(currentTheme);
  const signInButton = <ActionButton
    ariaLabel={translateMessage('sign in')}
    role='button'
    iconProps={{ iconName: 'Contact' }}
    onClick={() => signIn()}
    styles={actionButtonStyles}
  >
    {!mobileScreen && <FormattedMessage id='sign in' />}
  </ActionButton>;

  return (
    <>
      {!tokenPresent && signInButton}
      {tokenPresent && <Profile signIn={signIn}/>}
    </>
  );
}
