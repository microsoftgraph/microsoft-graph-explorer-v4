import {
  ActionButton,
  Callout,
  DefaultButton,
  FontWeights,
  IPersonaSharedProps,
  Label,
  Link,
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

import { geLocale } from '../../../../appLocale';
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

const trackOfficeDevProgramLinkClickEvent = () => {
  telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, {
    ComponentName: componentNames.OFFICE_DEV_PROGRAM_LINK
  });
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
  const toggleIsCalloutVisible = () => {setIsCalloutVisible(!isCalloutVisible)};
  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');

  useEffect(() => {
    if (authenticated && !profile) {
      dispatch(getProfileInfo());
    }
  }, [authenticated]);


  if (!profile) {
    return (<Spinner size={SpinnerSize.medium} />);
  }

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

  const handleSignOut = () => {
    dispatch(signOut());
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

  const personaStyleToken: any = {
    primaryText: {
      paddingBottom: 5
    },
    secondaryText:
    {
      paddingBottom: 10,
      textTransform: 'lowercase'
    }
  };

  const defaultSize = PersonaSize.size32;

  const userProfileProperties = {
    persona,
    styles: personaStyleToken,
    hidePersonaDetails: !isCalloutVisible,
    size: isCalloutVisible ? PersonaSize.size40 : defaultSize
  };

  const showProfileComponent = (profileProperties: any ): React.ReactNode => {

    const userPersona = <Persona
      {...profileProperties.persona}
      size={profileProperties.size}
      styles={profileProperties.styles}
      hidePersonaDetails={profileProperties.hidePersonaDetails} />;

    return( <>
      <ActionButton ariaLabel='profile'
        id={buttonId}
        onClick={toggleIsCalloutVisible}
        role='button'
      //menuProps={menuProperties}
      >
        {userPersona}
      </ActionButton>

      {isCalloutVisible &&  (
        <Callout
          className={styles.callout}
          ariaLabelledBy={labelId}
          ariaDescribedBy={descriptionId}
          role="dialog"
          gapSpace={0}
          target={`#${buttonId}`}
          isBeakVisible={true}
          beakWidth={10}
          onDismiss={toggleIsCalloutVisible}
          setInitialFocus
        >
          {userPersona}
          <hr/>
          <Stack>
            <Link
              key= 'office-dev-program'
              href={`https://developer.microsoft.com/${geLocale}/office/dev-program`}
              target="_blank"
              className={styles.link}
              onClick={() => trackOfficeDevProgramLinkClickEvent()}
            >
              {translateMessage('Office Dev Program')}
            </Link>
            <ActionButton key={'view-all-permissions'} onClick={() => changePanelState()}>
              {translateMessage('view all permissions')}
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
      {showProfileComponent(userProfileProperties)}
      <Panel
        isOpen={permissionsPanelOpen}
        onDismiss={() => changePanelState()}
        type={PanelType.medium}
        hasCloseButton={true}
        headerText={translateMessage('Permissions')}
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        closeButtonAriaLabel='Close'
      >
        <Permission panel={true} setPermissions={setPermissions} />
      </Panel>
    </div>
  );
}

const styles = mergeStyleSets({
  button: {
    width: 300
  },
  callout: {
    width: 320,
    maxWidth: '90%',
    padding: '20px 24px'
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight
  },
  link: {
    display: 'block',
    marginTop: 20
  }
});

// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
// @ts-ignore
export default styledProfile;
