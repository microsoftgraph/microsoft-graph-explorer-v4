import { ActionButton, getTheme } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { translateMessage } from '../../../utils/translate-messages';
import Profile from '../profile/Profile';

export function showSignInButtonOrProfile(
  tokenPresent: boolean,
  mobileScreen: boolean,
  signIn: Function
) {

  const currentTheme = getTheme();
  const signInButton = <ActionButton
    ariaLabel={translateMessage('sign in')}
    role='button'
    iconProps={{ iconName: 'Contact' }}
    onClick={() => signIn()}
    styles={{
      root:{
        height: 50,
        width: 80,
        ':hover': {
          background: `${currentTheme.palette.neutralLight} !important`
        }}}}
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
