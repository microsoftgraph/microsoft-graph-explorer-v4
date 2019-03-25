import hello from 'hellojs';
import { PrimaryButton } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAuthenticationProps, IAuthenticationState } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import { ADMIN_AUTH_URL, AUTH_URL, DEFAULT_USER_SCOPES , TOKEN_URL, USER_INFO_URL } from '../../services/constants';
import SubmitButton from '../common/submit-button/SubmitButton';
import './authentication.scss';
import { Profile } from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps,  IAuthenticationState> {
  public state = {
    authenticated: {
      status: false,
      user: {
        displayName: '',
        emailAddress: '',
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

  public signIn = () => {
    this.setState({
      loading: true,
    });
    const authenticated = this.state.authenticated;
    if (authenticated.status) {
      this.signOut();
    } else {
      this.initialiseAuthentication();
      hello('msft').login({
          response_type: 'token',
          scope: DEFAULT_USER_SCOPES,
          display: 'popup',
        });
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
      this.setState({
        authenticated,
        loading: false,
      });
    }
  };

  private initialiseAuthentication() {
    const { actions, queryActions } = this.props;
    hello.init({
      msft: {
        oauth: {
          version: 2,
          auth: AUTH_URL,
          grant: TOKEN_URL,
        },
        scope_delim: ' ',
        form: false,
      },
      msft_admin_consent: {
        oauth: {
          version: 2,
          auth: ADMIN_AUTH_URL,
          grant: TOKEN_URL,
        },
        scope_delim: ' ',
        form: false,
      },
    } as any);
    hello.init({
      msft: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
      msft_admin_consent: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
    }, {
        redirect_uri: window.location.pathname,
      });
    hello.on('auth.login', async (auth) => {
        let accessToken;
        const authenticated = {...this.state.authenticated};
        if (auth.network === 'msft') {
          const authResponse = hello('msft').getAuthResponse();
          accessToken = authResponse.access_token;
          if (accessToken) {
            authenticated.token = accessToken;
          }
          authenticated.status = true;
          if (actions) {
            actions.authenticateUser(authenticated);
          }
        }
        if (accessToken) {
          try {
            const userInfo = (queryActions) ? await queryActions.runQuery(USER_INFO_URL) : null;
            const jsonUserInfo = userInfo.response.body;
            authenticated.user = {...{},
                                  displayName: jsonUserInfo.displayName,
                                  emailAddress: jsonUserInfo.mail || jsonUserInfo.userPrincipalName,
            };
            if (actions) {
              actions.authenticateUser(authenticated);
              this.setState({
                authenticated,
                loading: false,
              });
            }
          } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
          }
        }
      });
  }

  public render() {
    const { authenticated, loading } = this.state;
    let buttonText = 'Sign In';
    if (authenticated.status) {
      buttonText = 'Sign Out';
    }

    return (
      <div className='authentication-container'>
        <SubmitButton className='signIn-button' text={buttonText} handleOnClick={this.signIn} submitting={loading} />
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
