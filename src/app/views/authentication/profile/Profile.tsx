import { IPersonaSharedProps, Persona, PersonaSize, Stack, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IProfileProps, IProfileState } from '../../../../types/profile';
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
  };

  public getInitials = (name: string) => {
    const n = name.indexOf('(');
    name = name.substring(0, n !== -1 ? n : name.length);
    const parts = name.split(' ');
    let initials = '';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== '') {
        initials += parts[i][0];
      }
    }
    initials = initials.substring(0, 2);
    return initials;
  };

  public render() {
    const { user } = this.state;

    const persona: IPersonaSharedProps = {
      imageUrl: user.profileImageUrl,
      imageInitials: this.getInitials(user.displayName),
      text: user.displayName,
      secondaryText: user.emailAddress,
    };

    const classes = classNames(this.props);

    return (
      <div className={classes.profile}>
        <Stack>
          <Persona {...persona} size={PersonaSize.size40} />
        </Stack>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(profileActionCreators, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(styled(Profile, authenticationStyles));
