import { ActionButton, getId, getTheme, TooltipHost } from '@fluentui/react';
import { translateMessage } from '../../../utils/translate-messages';
import Profile from '../profile/Profile';
import { profileButtonStyles } from './ProfileButton.styles';
import { AppOnlyToken } from '../../../services/actions/app-only-switch-action-creator';

export function showSignInButtonOrProfile(
  tokenPresent: boolean,
  signIn: Function,
  signInWithOther: Function,
  appOnlyCalls: AppOnlyToken
) {

  const currentTheme = getTheme();
  const { actionButtonStyles } = profileButtonStyles(currentTheme);
  const signInButton =
  <TooltipHost
    content={
      <div style={{padding:'3px'}}>
        {translateMessage('sign in')}
      </div>}
    id={getId()}
    calloutProps={{ gapSpace: 0 }}
  >
    <ActionButton
      ariaLabel={translateMessage('sign in')}
      role='button'
      iconProps={{ iconName: 'Contact' }}
      onClick={() => signIn()}
      styles={actionButtonStyles}
      disabled={appOnlyCalls.isAppOnly}
    />
  </TooltipHost>

  return (
    <>
      {!tokenPresent && signInButton}
      {tokenPresent && <Profile signInWithOther={signInWithOther}/>}
    </>
  );
}
