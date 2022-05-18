import {
  ActionButton,
  Callout,
  DefaultButton,
  getTheme,
  IOverlayProps,
  IPersonaSharedProps,
  Label,
  mergeStyleSets,
  Panel,
  PanelType,
  Persona,
  PersonaSize,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  styled
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useId } from '@fluentui/react-hooks';

import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IRootState } from '../../../../types/root';
import { signOut } from '../../../services/actions/auth-action-creators';
import { consentToScopes } from '../../../services/actions/permissions-action-creator';
import { togglePermissionsPanel } from '../../../services/actions/permissions-panel-action-creator';
import { getProfileInfo } from '../../../services/actions/profile-action-creators';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { Permission } from '../../query-runner/request/permissions';
import { authenticationStyles } from '../Authentication.styles';
import { profileStyles } from './Profile.styles';
import { authenticationWrapper } from '../../../../modules/authentication';

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
  const dispatch = useDispatch();
  const {
    profile,
    authToken,
    permissionsPanelOpen
  } = useSelector((state: IRootState) => state);
  const authenticated = authToken.token;
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const toggleIsCalloutVisible = () => { setIsCalloutVisible(!isCalloutVisible) };
  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');
  const theme = getTheme();
  const personaStyleToken = profileStyles(theme).personaStyleToken;
  const profileSpinnerStyles = profileStyles(theme).profileSpinnerStyles;


  useEffect(() => {
    if (authenticated) {
      dispatch(getProfileInfo());
    }
  }, [authenticated]);


  if (!profile) {
    return (<Spinner size={SpinnerSize.medium} styles={profileSpinnerStyles} />);
  }

  const handleSignOut = () => {
    dispatch(signOut());
  }

  const handleSignInOther = async () => {
    authenticationWrapper.clearSession();
    props.signIn();
  }

  const persona: IPersonaSharedProps = {
    imageUrl: profile.profileImageUrl,
    imageInitials: getInitials(profile.displayName),
    text: profile.displayName,
    secondaryText: profile.emailAddress
  };

  const changePanelState = () => {
    let open = !!permissionsPanelOpen;
    open = !open;
    dispatch(togglePermissionsPanel(open));
    setSelectedPermissions([]);
    trackSelectPermissionsButtonClickEvent();
  };

  const trackSelectPermissionsButtonClickEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.VIEW_ALL_PERMISSIONS_BUTTON
    });
  };

  const setPermissions = (permissions: []) => {
    setSelectedPermissions(permissions);
  };

  const handleConsent = () => {
    dispatch(consentToScopes(selectedPermissions));
    setSelectedPermissions([]);
  };

  const getSelectionDetails = () => {
    const selectionCount = selectedPermissions.length;

    switch (selectionCount) {
      case 0:
        return '';
      case 1:
        return `1 ${translateMessage('selected')}: ` + selectedPermissions[0];
      default:
        return `${selectionCount} ${translateMessage('selected')}`;
    }
  };

  const onRenderFooterContent = () => {
    return (
      <div>
        <Label>{getSelectionDetails()}</Label>
        <PrimaryButton
          disabled={selectedPermissions.length === 0}
          onClick={() => handleConsent()}
          style={{ marginRight: 10 }}
        >
          {translateMessage('Consent')}
        </PrimaryButton>
        <DefaultButton onClick={() => changePanelState()}>
          {translateMessage('Cancel')}
        </DefaultButton>
      </div>
    );
  };

  const classes = classNames(props);

  const panelOverlayProps: IOverlayProps = {
    isDarkThemed: true
  }

  const showProfileComponent = (userPersona: any): React.ReactNode => {

    const smallPersona = <Persona
      {...userPersona}
      size={PersonaSize.size32}
      styles={personaStyleToken}
      hidePersonaDetails={true} />;

    const fullPersona = <Persona
      {...userPersona}
      size={PersonaSize.size40}
      hidePersonaDetails={false}
      styles={personaStyleToken} />

    return (<>
      <ActionButton ariaLabel='profile'
        id={buttonId}
        onClick={toggleIsCalloutVisible}
        role='button'
        styles={{root: {':hover': {
          background: `${theme.palette.neutralLight} !important`
        }}}}
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
          isBeakVisible={true}
          beakWidth={10}
          onDismiss={toggleIsCalloutVisible}
          setInitialFocus
        >
          {fullPersona}
          <hr />
          <Stack>
            <ActionButton key={'view-all-permissions'} onClick={() => changePanelState()}>
              {translateMessage('view all permissions')}
            </ActionButton>
            <ActionButton key={'sign-other-account'} onClick={() => handleSignInOther()}>
              {translateMessage('sign in other account')}
            </ActionButton>
            <ActionButton key={'sign-out'} onClick={() => handleSignOut()}>
              {translateMessage('sign out')}
            </ActionButton>
          </Stack>
        </Callout>
      )}
    </>
    )
  }

  return (
    <div className={classes.profile}>
      {showProfileComponent(persona)}
      <Panel
        isOpen={permissionsPanelOpen}
        onDismiss={() => changePanelState()}
        type={PanelType.medium}
        hasCloseButton={true}
        headerText={translateMessage('Permissions')}
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        closeButtonAriaLabel='Close'
        overlayProps={panelOverlayProps}
      >
        <Permission panel={true} setPermissions={setPermissions} />
      </Panel>
    </div>
  );
}

const styles = mergeStyleSets({
  callout: {
    width: 320,
    maxWidth: '90%',
    padding: '20px 24px'
  }
});

// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
// @ts-ignore
export default styledProfile;
