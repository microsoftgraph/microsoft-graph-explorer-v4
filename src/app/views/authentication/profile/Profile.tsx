import {
  ActionButton, Callout, FontSizes, getTheme, IPersonaProps, IPersonaSharedProps, mergeStyleSets,
  Persona, PersonaSize, Spinner, SpinnerSize, Stack, styled
} from '@fluentui/react';
import { Button, Popover} from '@fluentui/react-components';
import { useId } from '@fluentui/react-hooks';
import { useEffect, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../store';
import { Mode } from '../../../../types/enums';
import { signOut } from '../../../services/slices/auth.slice';
import { usePopups } from '../../../services/hooks';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { authenticationStyles } from '../Authentication.styles';
import { useProfileStyles } from './Profile.styles';
import { getProfileInfo } from '../../../services/slices/profile.slice';
import { Guest20Filled } from '@fluentui/react-icons';
const getInitials = (name: string | undefined) => {
  let initials = '';
  if (name && name !== '') {
    const n = name.indexOf('(');
    name = name.substring(0, n !== -1 ? n : name.length);
    const parts = name.split(' ');
    for (const part of parts) {
      if (part.length > 0 && part !== '') {
        initials += part[0];
      }
    }
    initials = initials.substring(0, 2);
  }
  return initials;
};

const Profile = (props: any) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { profile, auth: { authToken }, graphExplorerMode } = useAppSelector((state) => state);
  const user = profile.user;

  const { show: showPermissions } = usePopups('full-permissions', 'panel');
  const authenticated = authToken.token;
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const toggleIsCalloutVisible = () => { setIsCalloutVisible(!isCalloutVisible) };

  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');
  const theme = getTheme();
  const { personaStyleToken, profileSpinnerStyles, permissionsLabelStyles, personaButtonStyles,
    profileContainerStyles } = useProfileStyles();

  useEffect(() => {
    if (authenticated) {
      dispatch(getProfileInfo());
    }
  }, [authenticated]);


  if (!profile) {
    return (<Spinner size={SpinnerSize.medium} className={profileSpinnerStyles} />);
  }

  const handleSignOut = () => {
    dispatch(signOut());
  }

  const handleSignInOther = async () => {
    props.signInWithOther();
  }

  const persona: IPersonaSharedProps = {
    imageUrl: user?.profileImageUrl,
    imageInitials: getInitials(user?.displayName),
    text: user?.displayName,
    secondaryText: user?.emailAddress
  };

  const changePanelState = () => {
    showPermissions({
      settings: {
        title: translateMessage('Permissions'),
        width: 'lg'
      }
    })
  };

  const classes = classNames(props);


  const onRenderSecondaryText = (prop: IPersonaProps): JSX.Element => {
    return (
      <span style={{ fontSize: FontSizes.small }}>
        {prop.secondaryText}
      </span>
    );
  }

  const showProfileComponent = (userPersona: any): React.ReactNode => {

    const smallPersona = <Persona
      {...userPersona}
      size={PersonaSize.size32}
      styles={personaStyleToken}
      hidePersonaDetails={true} />;

    const fullPersona = <Persona
      {...userPersona}
      size={PersonaSize.size72}
      hidePersonaDetails={false}
      onRenderSecondaryText={onRenderSecondaryText}
      styles={personaStyleToken} />

    return (<>
      <Button aria-label='profile'
        id={buttonId}
        onClick={toggleIsCalloutVisible}
        role='button'
        className={personaButtonStyles}
      >
        {smallPersona}
      </Button>

      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          ariaDescribedBy={descriptionId}
          role='dialog'
          gapSpace={0}
          target={`#${buttonId}`}
          isBeakVisible={false}
          beakWidth={10}
          onDismiss={toggleIsCalloutVisible}
          setInitialFocus
          styles={{ root: { border: '1px solid' + theme.palette.neutralTertiary } }}
        >
          <Stack horizontal horizontalAlign='space-between' styles={{ root: { paddingBottom: 0 } }}>
            {user &&
              <Button disabled={true}>{`${user.tenant}`}</Button>
            }
            <Button key={'sign-out'} onClick={() => handleSignOut()}>
              {translateMessage('sign out')}
            </Button>
          </Stack>
          <Stack styles={{ root: { paddingLeft: 10 } }}>{fullPersona}</Stack>
          {graphExplorerMode === Mode.Complete &&
            <Button key={'view-all-permissions'}
              onClick={() => changePanelState()} className={permissionsLabelStyles}>
              {translateMessage('view all permissions')}
            </Button>
          }
          <Stack styles={{ root: { background: theme.palette.neutralLighter, padding: 10 } }}>
            <Button key={'sign-other-account'} onClick={() => handleSignInOther()}
              icon = {<Guest20Filled />}
            >
              {translateMessage('sign in other account')}
            </Button>

          </Stack>
        </Callout>
      )}
    </>
    )
  }

  return (
    <div className={`${classes.profile} ${profileContainerStyles}`}>
      {showProfileComponent(persona)}
    </div>
  );
}

const styles = mergeStyleSets({
  callout: {
    width: 320,
    maxWidth: '90%'
  }
});

// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
// @ts-ignore
export default styledProfile;