import { styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IProfileProps, IProfileState } from '../../../../types/profile';
import * as profileActionCreators from '../../../services/actions/profile-action-creators';
import {
  USER_INFO_URL,
  USER_PICTURE_URL
} from '../../../services/graph-constants';
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
    let initials = '';
    if (name) {
      const names = name.split(' ');
      initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
    }
    return initials;
  };

  public render() {
    const { user } = this.state;
    const classes = classNames(this.props);

    return (
      <div className={classes.profile}>
        {user.profileImageUrl !== '' && <div className={classes.userImageArea}>
          <img
            className={classes.userImage}
            alt={user.displayName}
            src={user.profileImageUrl}
          />
        </div>}
        <div className={classes.userDetails}>
          <span className={classes.userName}>{user.displayName}</span>
          <br />
          <span className={classes.userEmail}>{user.emailAddress}</span>
        </div>
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
