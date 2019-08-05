import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IProfileProps, IProfileState } from '../../../../types/profile';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import {
  USER_INFO_URL,
  USER_PICTURE_URL
} from '../../../services/graph-constants';

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
      ? await actions.runQuery({
        selectedVerb: 'GET',
        sampleUrl: USER_INFO_URL
      }, true)
      : null;

    const userInfo = jsonUserInfo.response.body;

    let imageUrl = '';

    try {
      const userPicture = actions
        ? await actions.runQuery({
          selectedVerb: 'GET',
          sampleUrl: USER_PICTURE_URL
        }, true)
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
    return (
      <div className='profile'>
        <div className='user-imageArea'>
          <img
            className='user-image'
            alt={user.displayName}
            src={user.profileImageUrl}
          />
        </div>
        <div className='user-details'>
          <span className='user-name'>{user.displayName}</span>
          <br />
          <span className='user-email'>{user.emailAddress}</span>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(queryActionCreators, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Profile);
