import {
  ActionButton, Callout, FontSizes, getTheme, IPersonaProps, IPersonaSharedProps, mergeStyleSets,
  Persona, PersonaSize, Spinner, SpinnerSize, Stack, styled
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { globalCloud, storeCloudValue } from '../../../../modules/sovereign-clouds';
import { AppDispatch, useAppSelector } from '../../../../store';
import { Mode } from '../../../../types/enums';
import { signOut } from '../../../services/actions/auth-action-creators';
import { setActiveCloud } from '../../../services/actions/cloud-action-creator';
import { getProfileInfo } from '../../../services/actions/profile-action-creators';
import { usePopups } from '../../../services/hooks';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { authenticationStyles } from '../Authentication.styles';
import { profileStyles } from './Profile.styles';

const getInitials = (name: string) => {
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
  const dispatch: AppDispatch = useDispatch();
  const { profile, authToken, graphExplorerMode } = useAppSelector((state) => state);

  const { show: showPermissions } = usePopups('full-permissions', 'panel');
  const authenticated = authToken.token;
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const toggleIsCalloutVisible = () => { setIsCalloutVisible(!isCalloutVisible) };

  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');
  const theme = getTheme();
  const { personaStyleToken, profileSpinnerStyles, permissionsLabelStyles,
    personaButtonStyles, profileContainerStyles } = profileStyles(theme);

  useEffect(() => {
    if (authenticated) {
      dispatch(getProfileInfo());
    }
  }, [authenticated]);


  if (!profile) {
    return (<Spinner size={SpinnerSize.medium} styles={profileSpinnerStyles} />);
  }

  const handleSignOut = () => {
    storeCloudValue(globalCloud.name);
    dispatch(setActiveCloud(globalCloud));
    dispatch(signOut());
  }

  const handleSignInOther = async () => {
    props.signInWithOther();
  }

  const persona: IPersonaSharedProps = {
    imageUrl: profile.profileImageUrl,
    imageInitials: getInitials(profile.displayName),
    text: profile.displayName,
    secondaryText: profile.emailAddress
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
      <ActionButton ariaLabel='profile'
        id={buttonId}
        onClick={toggleIsCalloutVisible}
        role='button'
        styles={personaButtonStyles}
      >
        {smallPersona}
      </ActionButton>

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
            {profile &&
              <ActionButton text={`${profile.tenant}`} disabled={true} />
            }
            <ActionButton key={'sign-out'} onClick={() => handleSignOut()}>
              {translateMessage('sign out')}
            </ActionButton>
          </Stack>
          <Stack styles={{ root: { paddingLeft: 10 } }}>{fullPersona}</Stack>
          {graphExplorerMode === Mode.Complete &&
            <ActionButton key={'view-all-permissions'}
              onClick={() => changePanelState()} styles={permissionsLabelStyles}>
              {translateMessage('view all permissions')}
            </ActionButton>
          }
          <Stack styles={{ root: { background: theme.palette.neutralLighter, padding: 10 } }}>
            <ActionButton key={'sign-other-account'} onClick={() => handleSignInOther()}
              iconProps={{ iconName: 'AddFriend' }}
            >
              {translateMessage('sign in other account')}
            </ActionButton>

          </Stack>
        </Callout>
      )}
    </>
    )
  }

  return (
    <div className={classes.profile} style={profileContainerStyles}>
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