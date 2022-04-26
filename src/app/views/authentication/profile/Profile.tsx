import {
  ActionButton,
  DefaultButton,
  IPersonaSharedProps,
  Label,
  Panel,
  PanelType,
  Persona,
  PersonaSize,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  styled
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { geLocale } from '../../../../appLocale';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
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
    sidebarProperties,
    profile,
    authToken,
    permissionsPanelOpen,
    graphExplorerMode
  } = useSelector((state: IRootState) => state);
  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;
  const minimised = !mobileScreen && !showSidebar;
  const authenticated = authToken.token;
  const [selectedPermissions, setSelectedPermissions] = useState([]);

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

  const items: any = [
    {
      key: 'office-dev-program',
      text: translateMessage('Office Dev Program'),
      href: `https://developer.microsoft.com/${geLocale}/office/dev-program`,
      target: '_blank',
      iconProps: {
        iconName: 'CommandPrompt'
      },
      onClick: () => trackOfficeDevProgramLinkClickEvent()
    }
  ];

  if (authenticated) {
    items.push(
      {
        key: 'view-all-permissions',
        text: translateMessage('view all permissions'),
        iconProps: {
          iconName: 'AzureKeyVault'
        },
        onClick: () => changePanelState()
      },
      {
        key: 'sign-out',
        text: translateMessage('sign out'),
        onClick: () => handleSignOut(),
        iconProps: {
          iconName: 'SignOut'
        }
      }
    );
  }


  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items
  };

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

  const defaultSize = PersonaSize.size40;

  const profileProperties = {
    persona,
    styles: personaStyleToken,
    hidePersonaDetails: minimised,
    size: graphExplorerMode === Mode.TryIt ? PersonaSize.size40 : defaultSize
  };

  return (
    <div className={classes.profile}>
      {showProfileComponent(profileProperties, graphExplorerMode, menuProperties)}
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

function showProfileComponent(profileProperties: any, graphExplorerMode: Mode, menuProperties: any): React.ReactNode {
  const persona = <Persona
    {...profileProperties.persona}
    size={profileProperties.size}
    styles={profileProperties.styles}
    hidePersonaDetails={profileProperties.hidePersonaDetails} />;

  return <ActionButton ariaLabel='profile' role='button' menuProps={menuProperties}>
    {persona}
  </ActionButton>
}

// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
// @ts-ignore
export default styledProfile;
