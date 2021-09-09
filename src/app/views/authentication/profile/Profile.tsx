import { ActionButton, IPersonaSharedProps, Persona, PersonaSize, Spinner, SpinnerSize, styled } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../../appLocale';
import { Mode } from '../../../../types/enums';
import { IRootState } from '../../../../types/root';
import { getProfileInfo } from '../../../services/actions/profile-action-creators';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { authenticationStyles } from '../Authentication.styles';

const Profile = (props: any) => {
  const dispatch = useDispatch();
  const { sidebarProperties, profile, authToken, graphExplorerMode } = useSelector((state: IRootState) => state);
  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;
  const minimised = !mobileScreen && !showSidebar;
  const authenticated = authToken.token;

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
    const { actions } = props;

    if (actions) {
      actions.signOut();
    }
  }
  const persona: IPersonaSharedProps = {
    imageUrl: profile.profileImageUrl,
    imageInitials: getInitials(profile.displayName),
    text: profile.displayName,
    secondaryText: profile.emailAddress,
  };

  const classes = classNames(props);

  const menuProperties = {
    shouldFocusOnMount: true,
    alignTargetEdge: true,
    items: [
      {
        key: 'office-dev-program',
        text: translateMessage('Office Dev Program'),
        href: `https://developer.microsoft.com/${geLocale}/office/dev-program`,
        target: '_blank',
        iconProps: {
          iconName: 'CommandPrompt',
        },
      },
      {
        key: 'sign-out',
        text: translateMessage('sign out'),
        onClick: () => handleSignOut(),
        iconProps: {
          iconName: 'SignOut',
        },
      },
    ]
  };

  const personaStyleToken: any = {
    primaryText: {
      paddingBottom: 5,
    },
    secondaryText:
    {
      paddingBottom: 10,
      textTransform: 'lowercase'
    },
  };

  const defaultSize = minimised ? PersonaSize.size32 : PersonaSize.size48;

  const profileProperties = {
    persona,
    styles: personaStyleToken,
    hidePersonaDetails: minimised,
    size: graphExplorerMode === Mode.TryIt ? PersonaSize.size40 : defaultSize
  };

  return (
    <div className={classes.profile}>
      {showProfileComponent(profileProperties, graphExplorerMode, menuProperties)}
    </div>
  );
}

function showProfileComponent(profileProperties: any, graphExplorerMode: Mode, menuProperties: any): React.ReactNode {
  const persona = <Persona
    {...profileProperties.persona}
    size={profileProperties.size}
    styles={profileProperties.styles}
    hidePersonaDetails={profileProperties.hidePersonaDetails} />;

  if (graphExplorerMode === Mode.TryIt) {
    return <ActionButton ariaLabel='profile' role='button' menuProps={menuProperties}>
      {persona}
    </ActionButton>;
  }

  return persona;
}

// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
// @ts-ignore
export default styledProfile;
