import { styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IAuthenticationProps } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import { HelloAuthProvider } from '../../services/graph-client/HelloAuthProvider';
import { classNames } from '../classnames';
import SubmitButton from '../common/submit-button/SubmitButton';
import { authenticationStyles } from './Authentication.styles';
import Profile from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps> {
  constructor(props: IAuthenticationProps) {
    super(props);
  }

  public signIn = async (): Promise<void> => {
    new HelloAuthProvider().signIn();
  };

  public signOut = (): void => {
    const { actions } = this.props;

    if (actions) {
      actions.signOut();
    }
  };

  public render() {
    const { tokenPresent } = this.props;
    const classes = classNames(this.props);

    const buttonLabel = tokenPresent ? 'sign out' : 'sign in';
    return (
      <div className={classes.authenticationContainer}>
        <SubmitButton
          className={classes.signInButton}
          ariaLabel='Sign-in button'
          role='button'
          text={buttonLabel}
          handleOnClick={tokenPresent ? this.signOut : this.signIn}
          submitting={false}
        />
        {tokenPresent && <Profile />}
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
const styledAuthentication = styled(Authentication, authenticationStyles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(styledAuthentication);
