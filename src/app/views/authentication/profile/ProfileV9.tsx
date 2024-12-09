import {
  Body1,
  Button,
  CardFooter,
  CardHeader,
  Divider,
  makeStyles,
  Persona,
  PersonaProps,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip
} from '@fluentui/react-components';
import { PersonAdd20Regular, SignOut20Regular } from '@fluentui/react-icons';
import { forwardRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { IProfileState } from '../../../../types/profile';
import { signOut } from '../../../services/slices/auth.slice';
import { getProfileInfo } from '../../../services/slices/profile.slice';
import { translateMessage } from '../../../utils/translate-messages';
import { useHeaderStyles } from '../../main-header/utils';

const useProfileStyles = makeStyles({
  card: {
    margin: 'auto',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px'
  },
  headerImage: {
    borderRadius: '4px',
    maxWidth: '44px',
    maxHeight: '44px'
  },
  cardPreview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 0fr)'
  },
  footerButton: {
    width: '100%'
  }
});

interface ProfileProps {
  signInWithOther: ()=>Promise<void>;
  profile: IProfileState
}

const PersonaLayout = ({profile}: {profile: IProfileState}) => {
  const {error, status, user} = profile;
  const imageUrl = user?.profileImageUrl ?? '';

  if(error){
    return <Text>{translateMessage('Failed to get profile information')}: {error.message}</Text>
  }
  if(status === 'unset'){
    return  <Spinner size="small" label={translateMessage('Getting profile details')} />
  }
  return (
    <Persona
      textAlignment='center'
      size='extra-large'
      name={user?.displayName}
      presence={{ status: 'available' }}
      secondaryText={user?.emailAddress}
      tertiaryText={user?.profileType}
      avatar={{
        image: {
          src: imageUrl
        }
      }}
    />
  )
};


const PopoverContent: React.FC<Partial<PersonaProps> & ProfileProps> = (props) => {
  const dispatch = useAppDispatch();
  const styles = useProfileStyles();
  const {signInWithOther, profile} = props
  const user = profile.user
  const tenant = user && user.tenant ? user.tenant : 'Sample'

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div className={styles.card}>
      <CardHeader
        header={
          <Body1>
            <Text size={200} weight="semibold">{tenant}</Text>
          </Body1>
        }
        action={
          <Button
            appearance='transparent'
            icon={<SignOut20Regular />}
            aria-label={translateMessage('sign out')}
            onClick={handleSignOut}
          >
            {translateMessage('sign out')}
          </Button>
        }
      />
      <Divider/>
      <PersonaLayout profile={profile}/>
      <CardFooter>
        <Button
          className={styles.footerButton}
          onClick={signInWithOther} appearance="outline" icon={<PersonAdd20Regular />}>
          {translateMessage('sign in other account')}
        </Button>
      </CardFooter>
    </div>
  );
};

export const PersonaSignedIn = (props: Partial<PersonaProps>) => {
  return <Persona presence={{ status: 'available' }} {...props} />;
};

const SignedInButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  const styles = useHeaderStyles();

  return (
    <Tooltip content={translateMessage('sign out')} relationship='description'>
      <Button
        aria-label={translateMessage('sign out')}
        role='button'
        appearance='subtle'
        className={styles.iconButton}
        icon={<PersonaSignedIn />}
        ref={ref}
        {...props}
      />
    </Tooltip>
  );
});

SignedInButton.displayName = 'SignedInButton';

const ProfileV9 = ({ signInWithOther }: { signInWithOther: () => Promise<void> }) => {
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.profile);
  const authenticated = useAppSelector((state) => state.auth.authToken);

  useEffect(() => {
    if (authenticated) {
      dispatch(getProfileInfo());
    }
  }, [authenticated]);


  if (!profile) {
    return <Spinner />;
  }
  return (
    <Popover withArrow>
      <PopoverTrigger disableButtonEnhancement>
        <SignedInButton />
      </PopoverTrigger>

      <PopoverSurface tabIndex={-1}>
        <PopoverContent signInWithOther={signInWithOther} profile={profile}/>
      </PopoverSurface>
    </Popover>
  );
};

export { ProfileV9 };
