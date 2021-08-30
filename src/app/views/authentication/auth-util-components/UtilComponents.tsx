import { IconButton, PrimaryButton } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { translateMessage } from '../../../utils/translate-messages';
import Profile from '../profile/Profile';

export function showSignInButtonOrProfile(
  tokenPresent: boolean,
  mobileScreen: boolean,
  signIn: Function,
  minimised: boolean
) {

  const signInButton = minimised ? <IconButton
    ariaLabel={translateMessage('sign in')}
    role='button'
    iconProps={{ iconName: 'Contact' }}
    title={translateMessage('sign in')}
    onClick={() => signIn()} /> : <PrimaryButton
      ariaLabel={translateMessage('sign in')}
      role='button'
      iconProps={{ iconName: 'Contact' }}
      onClick={() => signIn()}
    >
    {!mobileScreen && <FormattedMessage id='sign in' />}
  </PrimaryButton>;

  return (
    <div>
      {!tokenPresent && signInButton}
      {tokenPresent && <Profile />}
    </div>
  );
}
