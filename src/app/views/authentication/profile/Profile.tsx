import { ActionButton, IPersonaSharedProps, Persona, PersonaSize, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Mode } from '../../../../types/enums';
import { IProfileProps, IProfileState } from '../../../../types/profile';
import * as authActionCreators from '../../../services/actions/auth-action-creators';
import * as profileActionCreators from '../../../services/actions/profile-action-creators';
import { USER_INFO_URL, USER_PICTURE_URL } from '../../../services/graph-constants';
import { classNames } from '../../classnames';
import { authenticationStyles } from '../Authentication.styles';

export class Profile extends Component<IProfileProps, IProfileState> {
  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      user: {
        displayName: '',
        emailAddress: '',
        profileImageUrl: ''
      }
    };
  }

  public componentDidMount = async () => {
    const { actions } = this.props;

    const jsonUserInfo = actions
      ? await actions.getProfileInfo({
        selectedVerb: 'GET',
        sampleUrl: USER_INFO_URL
      })
      : null;

    const userInfo = jsonUserInfo.response;
    if (userInfo) {
      let imageUrl = '';

      try {
        const userPicture = actions
          ? await actions.getProfileInfo({
            selectedVerb: 'GET',
            sampleUrl: USER_PICTURE_URL
          })
          : null;

        if (userPicture) {
          const buffer = await userPicture.response.arrayBuffer();
          const blob = new Blob([buffer], { type: 'image/jpeg' });
          imageUrl = URL.createObjectURL(blob);
        }
      } catch (error) {
        imageUrl = '';
      }

      const user = {
        ...{},
        displayName: userInfo.displayName,
        emailAddress: userInfo.mail || userInfo.userPrincipalName,
        profileImageUrl: imageUrl
      };

      this.setState({
        user
      });
    }

  };

  public getInitials = (name: string) => {
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

  public handleSignOut = () => {
    const { actions } = this.props;

    if (actions) {
      actions.signOut();
    }
  }

  public render() {
    const { user } = this.state;
    const {
      intl: { messages },
      mobileScreen,
      minimised,
      graphExplorerMode,
    }: any = this.props;

    const persona: IPersonaSharedProps = {
      imageUrl: user.profileImageUrl,
      imageInitials: this.getInitials(user.displayName),
      text: user.displayName,
      secondaryText: user.emailAddress,
    };

    const classes = classNames(this.props);

    const menuProperties = {
      shouldFocusOnMount: true,
      alignTargetEdge: true,
      items: [
        {
          key: 'office-dev-program',
          text: messages['Office Dev Program'],
          href: 'https://developer.microsoft.com/en-us/office/dev-program',
          target: '_blank',
          iconProps: {
            iconName: 'CommandPrompt',
          },
        },
        {
          key: 'sign-out',
          text: messages['sign out'],
          onClick: () => this.handleSignOut(),
          iconProps: {
            iconName: 'SignOut',
          },
        },
      ]
    };

    const personaStyleToken: any = {
      secondaryText:
      {
        paddingBottom: 10,
        textTransform: 'lowercase'
      },
    };

    const defaultSize = minimised ? PersonaSize.size32 : PersonaSize.size72;

    const profileProperties = {
      persona,
      styles: personaStyleToken,
      hidePersonaDetails: minimised,
      size: graphExplorerMode === Mode.TryIt ? PersonaSize.size40 : defaultSize
    };

    return (
      <div className={classes.profile}>
        {mobileScreen &&
          <ActionButton ariaLabel='profile' role='button' menuProps={menuProperties}>
            <Persona {...persona} size={PersonaSize.size40} hidePersonaDetails={true} />
          </ActionButton>
        }

        {!mobileScreen && graphExplorerMode === Mode.TryIt ?
          <ActionButton ariaLabel='profile' role='button' menuProps={menuProperties}>
            {this.showProfileComponent(profileProperties)}
          </ActionButton> : this.showProfileComponent(profileProperties)}
      </div>
    );
  }

  private showProfileComponent(profileProperties: any): React.ReactNode {
    return <Persona
      {...profileProperties.persona}
      size={profileProperties.size}
      styles={profileProperties.styles}
      hidePersonaDetails={profileProperties.hidePersonaDetails} />;
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      ...profileActionCreators,
      ...authActionCreators
    }, dispatch)
  };
}

function mapStateToProps(state: any) {
  const mobileScreen = !!state.sidebarProperties.mobileScreen;
  const showSidebar = !!state.sidebarProperties.showSidebar;

  return {
    mobileScreen: !!state.sidebarProperties.mobileScreen,
    appTheme: state.theme,
    minimised: !mobileScreen && !showSidebar,
    graphExplorerMode: state.graphExplorerMode
  };
}


// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
const IntlProfile = injectIntl(styledProfile);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntlProfile);
