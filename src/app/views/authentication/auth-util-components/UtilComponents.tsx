import { PrimaryButton, Stack } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Profile from '../profile/Profile';

export function showSignInButtonOrProfile(tokenPresent: boolean, mobileScreen: boolean, signIn: Function) {
  return (
    <Stack>
      <Stack.Item align='start'>
        {!tokenPresent &&
          <PrimaryButton
            ariaLabel='Sign-in button'
            role='button'
            iconProps={{ iconName: 'Contact' }}
            onClick={() => signIn()}
          >
            {!mobileScreen && <FormattedMessage id='sign in' />}
          </PrimaryButton>}
      </Stack.Item>
      {tokenPresent && <Profile />}
    </Stack>
  );
}
