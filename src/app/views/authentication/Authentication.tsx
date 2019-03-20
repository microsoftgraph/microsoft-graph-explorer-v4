import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import './authentication.scss';

export class Authentication extends Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className='authentication-container'>
        <PrimaryButton className='signIn-button'>Sign In</PrimaryButton>
        <div className='authentication-details'>
            <span className ='user-name'>Megan Bowen</span><br/>
            <span className='user-email'>MeganB@M365x214355.onmicrosoft.com</span>
        </div>
      </div>
    );
  }
}

export default Authentication;
