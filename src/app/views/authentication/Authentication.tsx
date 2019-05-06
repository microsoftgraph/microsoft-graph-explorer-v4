import hello from 'hellojs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IAuthenticationProps, IAuthenticationState } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import { HelloAuthProvider } from '../../services/graph-client/HelloAuthProvider';
import SubmitButton from '../common/submit-button/SubmitButton';
import './authentication.scss';
import { getAccessToken, getImageUrl, getUserInfo } from './AuthUtility';
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

  public signIn = async (): Promise<void> => {
    const { actions } = this.props;

    if (actions) {
      actions.authenticateUser();
    }
  };

  public componentDidMount = () => {
    new HelloAuthProvider()
      .getAccessToken()
      .then(token => console.log(token));
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
      this.setState({
        authenticatedUser,
        loading: false,
      });
    }
  };

  public render() {
    const { authenticatedUser, loading } = this.state;
    const buttonLabel = (authenticatedUser && authenticatedUser.status) ? 'sign out' : 'sign in';
    return (
      <div className='authentication-container'>
        <SubmitButton className='signIn-button' text={buttonLabel} handleOnClick={this.signIn} submitting={false} />
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

function mapStateToProps(state: any) {
  return {
    authenticatedUser: state.authResponse.authenticatedUser,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Authentication);
