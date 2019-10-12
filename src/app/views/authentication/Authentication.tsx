import { ActionButton, Stack, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAuthenticationProps } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import { HelloAuthProvider } from '../../services/graph-client/HelloAuthProvider';
import { classNames } from '../classnames';
import { authenticationStyles } from './Authentication.styles';
import Profile from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps> {
  constructor(props: IAuthenticationProps) {
    super(props);
  }

  public signIn = async (): Promise<void> => {
    new HelloAuthProvider().signIn();
  };

  public render() {
    const { tokenPresent } = this.props;
    const classes = classNames(this.props);

    return (
      <div className={classes.authenticationContainer}>
        <Stack>
          <Stack.Item align='end'>
            {!tokenPresent && <ActionButton
              ariaLabel='Sign-in button'
              className={classes.signInButton}
              role='button'
              iconProps={{ iconName: 'Contact' }}
              onClick={this.signIn}>
              sign in
              </ActionButton>}
          </Stack.Item>
            {tokenPresent &&
              <Profile />}
        </Stack>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    tokenPresent: !!state.authToken
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(authActionCreators, dispatch)
  };
}

// @ts-ignore
const StyledAuthentication = styled(Authentication, authenticationStyles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledAuthentication);
