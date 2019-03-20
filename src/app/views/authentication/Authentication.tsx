import hello from 'hellojs';
import { PrimaryButton } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAuthenticationProps, IAuthenticationState } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import './authentication.scss';

export class Authentication extends Component<IAuthenticationProps,  IAuthenticationState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},
    };
  }

  private readonly userInfoUrl = `https://graph.microsoft.com/v1.0/me`;

  public signIn = () => {
    const { actions, queryActions } = this.props;
    hello.init({
      msft: {
        oauth: {
          version: 2,
          auth:
            'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
          grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        },
        scope_delim: ' ',
        form: false,
      },
      msft_admin_consent: {
        oauth: {
          version: 2,
          auth: 'https://login.microsoftonline.com/common/adminconsent',
          grant: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        },
        scope_delim: ' ',
        form: false,
      },
    } as any);
    hello.init(
      {
        msft: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
        msft_admin_consent: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
      },
      {
        redirect_uri: window.location.pathname,
      },
    );
    hello('msft').login({
        response_type: 'token',
        scope:
          'openid profile User.ReadWrite User.ReadBasic.All Sites.ReadWrite.All Contacts.ReadWrite ' +
          'People.Read Notes.ReadWrite.All Tasks.ReadWrite Mail.ReadWrite Files.ReadWrite.All Calendars.ReadWrite',
        display: 'popup',
      });
    hello.on('auth.login', async (auth) => {
        let accessToken;
        if (auth.network === 'msft') {
          const authResponse = hello('msft').getAuthResponse();
          accessToken = authResponse.access_token;
        }
        if (accessToken) {
          try {
            let user = {};
            const userInfo = (queryActions) ? await queryActions.runQuery(this.userInfoUrl) : null;
            const jsonUserInfo = userInfo.response.body;
            user = {...user,
                    displayName: jsonUserInfo.displayName,
                    emailAddress: jsonUserInfo.mail || jsonUserInfo.userPrincipalName,
            };
            if (actions) {
              actions.authenticateUser(user);
            }
          } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
          }
        }
      });
  };

  public render() {
    return (
      <div className='authentication-container'>
        <PrimaryButton onClick={this.signIn} className='signIn-button'>
          Sign In
        </PrimaryButton>
        <div className='authentication-details'>
          <span className='user-name'>Megan Bowen</span>
          <br />
          <span className='user-email'>MeganB@M365x214355.onmicrosoft.com</span>
        </div>
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
export default connect(
  null,
  mapDispatchToProps,
)(Authentication);
