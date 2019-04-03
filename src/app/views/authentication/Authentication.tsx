import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IAuthenticationProps, IAuthenticationState } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import SubmitButton from '../common/submit-button/SubmitButton';
import './authentication.scss';
import { getAccessToken, getImageUrl, getUserInfo, logOut } from './AuthService';
import { Profile } from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps,  IAuthenticationState> {
  constructor(props: IAuthenticationProps) {
    super(props);
    this.state = {
      authenticatedUser: {
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
  }

  public componentDidMount = () => {
    const authenticatedUser = localStorage.getItem('authenticatedUser');
    const authUser = (authenticatedUser) ? JSON.parse(authenticatedUser) : null;
    if (authenticatedUser && this.props.actions && authUser.status) {
      this.props.actions.authenticateUser(authUser);
      this.setState({
        authenticatedUser: authUser,
      });
    }
  }

  public signIn = async (): Promise<void> => {
    const { queryActions, actions } = this.props;
    let { authenticatedUser } = this.state;
    this.setState({
      loading: true,
    });
    if (authenticatedUser.status) {
      this.signOut();
    } else {
      const accessToken = await getAccessToken();
      if (accessToken) {
        authenticatedUser.token = accessToken;
        authenticatedUser.status = true;
        if (actions) {
          actions.authenticateUser(authenticatedUser);
          localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
        }
        try {
          const userInfo = await getUserInfo(queryActions);
          authenticatedUser.user = {...{},
                                    displayName: userInfo.displayName,
                                    emailAddress: userInfo.mail || userInfo.userPrincipalName,
                                    profileImageUrl: '',
          };
          if (actions) {
            actions.authenticateUser(authenticatedUser);
            this.setState({
              authenticatedUser,
            });
            localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
          }
          try {
            const imageUrl = await getImageUrl(queryActions);
            if (actions) {
              authenticatedUser = this.state.authenticatedUser;
              authenticatedUser.user.profileImageUrl = imageUrl;
              actions.authenticateUser(authenticatedUser);
              this.setState({
                authenticatedUser,
                loading: false,
              });
              localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
            }
          } catch (e) {
            if (actions) {
              authenticatedUser = this.state.authenticatedUser;
              authenticatedUser.user.profileImageUrl = '';
              actions.authenticateUser(authenticatedUser);
              this.setState({
                authenticatedUser,
                loading: false,
              });
              localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
            }
          }
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.log(e);
        }
      }
    }
  };

  public signOut = (): void => {
    const { actions } = this.props;
    if (actions) {
      const authenticatedUser = {
        status: false,
        user: {
          displayName: '',
          emailAddress: '',
          profileImageUrl: '',
        },
        token: '',
      };
      actions.authenticateUser(authenticatedUser);
      logOut();
      this.setState({
        authenticatedUser,
        loading: false,
      });
    }
  };

  public render() {
    const { authenticatedUser, loading } = this.state;
    const buttonLabel = authenticatedUser.status ? 'sign out' : 'sign in';

    return (
      <div className='authentication-container'>
        <SubmitButton className='signIn-button' text={buttonLabel} handleOnClick={this.signIn} submitting={loading} />
        <Profile user={authenticatedUser.user}/>
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
    authenticatedUser: state.authenticatedUser,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Authentication);
