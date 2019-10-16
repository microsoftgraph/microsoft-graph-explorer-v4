import {
  ActionButton, IPersonaSharedProps, Persona,
  PersonaSize, styled
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Card } from '@uifabric/react-cards';
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

    const userInfo = jsonUserInfo.response.body;
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
          const buffer = await userPicture.response.body.arrayBuffer();
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
    const { mobileScreen } = this.props;

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
          text: 'Office Dev Program',
          href: 'https://developer.microsoft.com/en-us/office/dev-program',
          target: '_blank',
          iconProps: {
            iconName: 'CommandPrompt',
          },
        },
        {
          key: 'sign-out',
          text: 'Sign Out',
          onClick: () => this.handleSignOut(),
          iconProps: {
            iconName: 'SignOut',
          },
        },
      ]
    };

    const profileCardTokens: any = {
      boxShadow: 'none',
      childrenGap: 15,
      padding: 10,
      minWidth: 0
    };


    return (
      <div className={classes.profile}>
        {mobileScreen &&
          <ActionButton ariaLabel='profile' role='button' menuProps={menuProperties}>
            <Persona {...persona} size={PersonaSize.size40} hidePersonaDetails={true} />
          </ActionButton>
        }

        {!mobileScreen &&
          <Card compact={true} tokens={profileCardTokens}>
            <Card.Item fill={true}>
            <Persona {...persona} coinSize={80} size={PersonaSize.size40} hidePersonaDetails={true} />
            </Card.Item>
          <Card.Section>
            <span className={classes.personaText}>
              {persona.text}
            </span>
            <span className={classes.personaSecondaryText}>{persona.secondaryText}</span>
            <ActionButton ariaLabel='profile' role='button' menuProps={menuProperties}>
              More actions
            </ActionButton>
          </Card.Section>
          </Card>
        }
      </div>
    );
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
  return {
    mobileScreen: !!state.sidebarProperties.showToggle
  };
}


// @ts-ignore
const styledProfile = styled(Profile, authenticationStyles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(styledProfile);
