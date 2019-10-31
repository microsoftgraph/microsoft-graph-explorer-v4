import { FontSizes, Icon, Label, PrimaryButton, Stack, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { FormattedMessage } from 'react-intl';
import { IAuthenticationProps } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import { msalApplication } from '../../services/graph-client/msal-agent';
import { acquireNewAccessToken, logIn } from '../../services/graph-client/msal-service';
import { DEFAULT_USER_SCOPES } from '../../services/graph-constants';
import { classNames } from '../classnames';
import { authenticationStyles } from './Authentication.styles';
import Profile from './profile/Profile';

export class Authentication extends Component<IAuthenticationProps> {
  constructor(props: IAuthenticationProps) {
    super(props);
    this.acquireTokenCallBack = this.acquireTokenCallBack.bind(this);
    this.acquireTokenErrorCallback = this.acquireTokenErrorCallback.bind(this);

    msalApplication.handleRedirectCallback(this.acquireTokenCallBack, this.acquireTokenErrorCallback);
  }

  public componentDidMount() {
    const account = msalApplication.getAccount();

    if (account) {
      acquireNewAccessToken(msalApplication, DEFAULT_USER_SCOPES.split(' '))
        .then(this.acquireTokenCallBack)
        .then(this.acquireTokenErrorCallback);
    }
  }

  public async signIn() {
    await logIn()
      .then(this.acquireTokenCallBack)
      .catch(this.acquireTokenErrorCallback);
  }

  public async acquireTokenCallBack(response: any) {
    if (response && response.tokenType === 'access_token') {
      this.props.actions!.signIn(response.accessToken);
      this.props.actions!.storeScopes(response.scopes);
    } else if (response && response.tokenType === 'id_token') {
      await acquireNewAccessToken(msalApplication)
        .then(this.acquireTokenCallBack).catch(this.acquireTokenErrorCallback);
    }
  }

  public acquireTokenErrorCallback(error: any) {
    // tslint:disable-next-line:no-console
    console.log(error);
  }

  public render() {
    const { tokenPresent, mobileScreen } = this.props;
    const classes = classNames(this.props);

    const authLabel = {
      fontSize: FontSizes.large,
      fontWeight: 400,
    };

    const authIcon = {
      margin: '0 5px'
    };

    const authenticationStack = <Stack>
      <Stack.Item align='start'>
        {!tokenPresent &&
          <PrimaryButton
            ariaLabel='Sign-in button'
            role='button'
            iconProps={{ iconName: 'Contact' }}
            onClick={this.signIn}
          >
            {!mobileScreen && <FormattedMessage id='sign in' />}
          </PrimaryButton>}
        {tokenPresent && <Profile />}
      </Stack.Item>
    </Stack>;


    return (
      <div className={classes.authenticationContainer}>
        {!mobileScreen && <Stack>
          {!tokenPresent &&
            <>
              <Label style={authLabel}>
                <Icon iconName='Permissions' style={authIcon} />
                <FormattedMessage id='Authentication' />
              </Label>
              <br />
              <Label>
                <FormattedMessage id='Using demo tenant' /> <FormattedMessage id='To access your own data:' />
              </Label>
            </>
          }
          <span><br />{authenticationStack}<br /> </span>
        </Stack>}
        {mobileScreen && authenticationStack}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    tokenPresent: !!state.authToken,
    mobileScreen: !!state.sidebarProperties.showToggle,
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
