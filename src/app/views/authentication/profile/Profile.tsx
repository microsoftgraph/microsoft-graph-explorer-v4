import {
  Body1,
  Button,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  makeStyles,
  Persona,
  PersonaProps,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useId
} from '@fluentui/react-components';
import { PersonAdd20Regular, SignOut20Regular } from '@fluentui/react-icons';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { IProfileState } from '../../../../types/profile';
import { signOut } from '../../../services/slices/auth.slice';
import { getProfileInfo } from '../../../services/slices/profile.slice';
import { translateMessage } from '../../../utils/translate-messages';
import { useHeaderStyles } from '../../main-header/utils';
import { usePopups } from '../../../services/hooks/usePopups';
import { resetCustomSamples } from '../../../services/custom-samples';
import { getDevxAccount } from '../../../services/devx-api';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';

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


const PopoverContent: React.FC<Partial<PersonaProps> & ProfileProps & {
  onCustomSamples: () => void; onResetSamples: () => void;
}> = (props) => {
  const dispatch = useAppDispatch();
  const styles = useProfileStyles();
  const {signInWithOther, profile} = props;
  const user = profile.user;
  const tenant = user && user.tenant ? user.tenant : 'Sample';
  const { show: showPermissions } = usePopups('full-permissions', 'panel');
  const devxApi = useAppSelector(state => state.devxApi);
  const authenticated = useAppSelector(state => !!state.auth.authToken.token);
  const account = getDevxAccount(authenticated);
  const eligible = devxApi.eligible && account.eligible && account.accountKey === devxApi.accountKey;

  const handleSignOut = () => {
    dispatch(signOut());
  };


  const changePanelState = () => {
    showPermissions({
      settings: {
        title: translateMessage('Permissions'),
        width: 'lg'
      }
    })
  };

  return (
    <div role="dialog" id="profileContent" className={styles.card}>
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
      <Link key={'view-all-permissions'}
        onClick={() => changePanelState()}>
        {translateMessage('view all permissions')}
      </Link>
      {eligible && (
        <Button appearance='outline' onClick={devxApi.custom ? props.onResetSamples : props.onCustomSamples}>
          {translateMessage(devxApi.custom ? 'Reset samples' : 'Custom samples')}
        </Button>
      )}
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
  const user = useAppSelector((state) => state.profile.user);
  const imageUrl = user?.profileImageUrl ?? '';

  return (
    <Tooltip content={translateMessage('sign out')} relationship='description'>
      <Button
        aria-label={`${user?.displayName} ${translateMessage('sign out')}`}
        aria-haspopup='dialog'
        aria-expanded={false}
        aria-controls='profileContent'
        appearance='subtle'
        className={styles.iconButton}
        ref={ref}
        {...props}>
        <Persona
          name={user?.displayName}
          className={styles.iconButton}
          presence={{ status: 'available' }}
          avatar={{
            image: {
              src: imageUrl
            }
          }}
        />
      </Button>
    </Tooltip>
  );
});

SignedInButton.displayName = 'SignedInButton';

const ProfileV9 = ({ signInWithOther }: { signInWithOther: () => Promise<void> }) => {
  const dispatch = useAppDispatch();
  const ariaId = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const devxApi = useAppSelector(state => state.devxApi);
  const { show: showCustomSamples } = usePopups<{ accountKey: string }>('custom-samples', 'dialog');

  const openCustomSamples = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.CUSTOM_SAMPLES_BUTTON });
    setOpen(false);
    showCustomSamples({
      settings: { title: translateMessage('Custom samples'), trigger },
      data: { accountKey: devxApi.accountKey || '' }
    });
  };

  const resetSamples = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, { ComponentName: componentNames.RESET_SAMPLES_BUTTON });
    setOpen(false);
    dispatch(resetCustomSamples());
  };

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

  const cardAriaLabel = `${profile.user?.displayName}'s ${translateMessage('profile')} ${translateMessage('card')}`;

  return (
    <Popover withArrow inertTrapFocus open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <PopoverTrigger disableButtonEnhancement>
        <SignedInButton ref={trigger} />
      </PopoverTrigger>

      <PopoverSurface aria-label={cardAriaLabel} aria-live='polite' aria-labelledby={ariaId}>
        <PopoverContent signInWithOther={signInWithOther} profile={profile}
          onCustomSamples={openCustomSamples} onResetSamples={resetSamples}/>
      </PopoverSurface>
    </Popover>
  );
};

export { ProfileV9 };
