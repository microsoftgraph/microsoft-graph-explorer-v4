import hello from 'hellojs';
import { PrimaryButton } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import './authentication.scss';

export class Authentication extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public signIn() {
    hello.init({
        msft: {
          oauth: {
            version: 2,
            auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
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
    hello.init({
        msft: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
        msft_admin_consent: 'cb2d7367-7429-41c6-ab18-6ecb336139a6',
        scope: 'openid',
      }, {
          redirect_uri: window.location.pathname,
        });

    hello('msft').login({
            response_type: 'token',
            scope: 'openid profile User.ReadWrite User.ReadBasic.All Sites.ReadWrite.All Contacts.ReadWrite ' +
            'People.Read Notes.ReadWrite.All Tasks.ReadWrite Mail.ReadWrite Files.ReadWrite.All Calendars.ReadWrite',
            display: 'popup',
        }).then((response) => {
            // tslint:disable-next-line:no-console
            console.log(response);
            }, (e) => {
                // tslint:disable-next-line:no-console
                console.log(e);
        });

  }

  public render() {
    return (
      <div className='authentication-container'>
        <PrimaryButton onClick={this.signIn} className='signIn-button'>Sign In</PrimaryButton>
        <div className='authentication-details'>
            <span className ='user-name'>Megan Bowen</span><br/>
            <span className='user-email'>MeganB@M365x214355.onmicrosoft.com</span>
        </div>
      </div>
    );
  }
}

export default Authentication;
