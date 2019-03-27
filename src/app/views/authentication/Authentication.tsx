import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAuthenticationProps, IAuthenticationState } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import { USER_INFO_URL, USER_PICTURE_URL } from '../../services/constants';
import SubmitButton from '../common/submit-button/SubmitButton';
import './authentication.scss';
import { getAccessToken, logOut } from './AuthService';
import { Profile } from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps,  IAuthenticationState> {
  public state = {
    authenticated: {
      status: false,
      user: {
        displayName: '',
        emailAddress: '',
        profileImageUrl: '',
      },
      token: '',
    },
    loading: false,
  };

  public componentDidMount = () => {
    const authenticated = localStorage.getItem('authenticated');
    if (authenticated && this.props.actions && JSON.parse(authenticated).status) {
      this.props.actions.authenticateUser(JSON.parse(authenticated));
      this.setState({
        authenticated: JSON.parse(authenticated),
      });
    }
  }

  public signIn = async () => {
    const { queryActions, actions } = this.props;
    let authenticated = {...this.state.authenticated};
    this.setState({
      loading: true,
    });
    if (authenticated.status) {
      this.signOut();
    } else {
      const accessToken = await getAccessToken();
      if (accessToken) {
        authenticated.token = accessToken;
        authenticated.status = true;
        if (actions) {
          actions.authenticateUser(authenticated);
        }
        try {
          const userInfo = await this.getUserInfo(queryActions);
          authenticated.user = {...{},
                                displayName: userInfo.displayName,
                                emailAddress: userInfo.mail || userInfo.userPrincipalName,
                                profileImageUrl: '',
          };
          if (actions) {
            actions.authenticateUser(authenticated);
            this.setState({
              authenticated,
            });
          }
          try {
            const imageUrl = await this.getImageUrl(queryActions);
            if (actions) {
              authenticated = this.state.authenticated;
              authenticated.user.profileImageUrl = imageUrl;
              actions.authenticateUser(authenticated);
              this.setState({
                authenticated,
                loading: false,
              });
            }
          } catch (e) {
            if (actions) {
              authenticated = this.state.authenticated;
              authenticated.user.profileImageUrl = '';
              actions.authenticateUser(authenticated);
              this.setState({
                authenticated,
                loading: false,
              });
            }
          }
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.log(e);
        }
      }
    }
  };

  public signOut = () => {
    const { actions } = this.props;
    if (actions) {
      const authenticated = {
        status: false,
        user: {
          displayName: null,
          emailAddress: null,
        },
        token: null,
      };
      actions.authenticateUser(authenticated);
      logOut();
      this.setState({
        authenticated,
        loading: false,
      });
    }
  };

  private async getUserInfo(queryActions: any) {
    const userInfo = (queryActions) ? await queryActions.runQuery({
      sampleURL: USER_INFO_URL,
    }) : null;
    const jsonUserInfo = userInfo.response.body;
    return jsonUserInfo;
  }

  private async getImageUrl(queryActions: any) {
    const userPicture = (queryActions) ? await queryActions.runQuery({
      sampleURL: USER_PICTURE_URL,
    }) : null;
    const buffer = await userPicture.response.body.arrayBuffer();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }

  public render() {
    const { authenticated, loading } = this.state;
    const buttonLabel = authenticated.status ? 'sign out' : 'sign in';

    return (
      <div className='authentication-container'>
        <SubmitButton className='signIn-button' text={buttonLabel} handleOnClick={this.signIn} submitting={loading} />
        <Profile user={authenticated.user}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(authActionCreators, dispatch),
    queryActions: bindActionCreators(queryActionCreators, dispatch),
  };
}

function mapStateToProps(state: IAuthenticationState) {
  return {
    authenticated: state.authenticated,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Authentication);
