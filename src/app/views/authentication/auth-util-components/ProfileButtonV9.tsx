import { Button, Persona, PersonaProps, Tooltip } from '@fluentui/react-components';
import { translateMessage } from '../../../utils/translate-messages';
import { useHeaderStyles } from '../../main-header/utils';
import Profile from '../profile/Profile';

export const PersonaSignIn = (props: Partial<PersonaProps>) => {
  return (
    <Persona
      presence={{ status: 'offline' }}
      {...props}
    />
  );
};

const SignInButton = ({signIn}: {signIn: ()=> void})=>{
  const styles = useHeaderStyles()
  return (
    <Tooltip
      content={translateMessage('sign in')}
      relationship="description">
      <Button
        aria-label={translateMessage('sign in')}
        role='button'
        appearance='subtle'
        className={styles.iconButton}
        icon={<PersonaSignIn/>}
        onClick={signIn}
      />
    </Tooltip>
  )
}
export function showSignInButtonOrProfile(
  tokenPresent: boolean,
  signIn: () => void,
  signInWithOther: Function
) {
  return (
    <>
      {!tokenPresent && <SignInButton signIn={signIn}/>}
      {tokenPresent && <Profile signInWithOther={signInWithOther}/>}
    </>
  );
}
