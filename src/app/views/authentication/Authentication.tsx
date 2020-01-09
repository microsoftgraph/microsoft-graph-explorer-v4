import { Icon, Label, Spinner, SpinnerSize, Stack, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { FormattedMessage } from 'react-intl';
import { IAuthenticationProps } from '../../../types/authentication';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import { logIn } from '../../services/graph-client/msal-service';
import { classNames } from '../classnames';
import { Settings } from '../settings';
import { showSignInButtonOrProfile } from './auth-util-components';
import { authenticationStyles } from './Authentication.styles';

export class Authentication extends Component<IAuthenticationProps, { loginInProgress: boolean }> {
  constructor(props: IAuthenticationProps) {
    super(props);
    this.state = { loginInProgress: false };
  }

  public signIn = async (): Promise<void> => {
    this.setState({ loginInProgress: true });

    const { mscc } = (window as any);

    if (mscc) {
      mscc.setConsent();
    }

    const authResponse = await logIn();
    if (authResponse) {
      this.setState({ loginInProgress: false });

      this.props.actions!.signIn(authResponse.accessToken);
      this.props.actions!.storeScopes(authResponse.scopes);
    }

    this.setState({ loginInProgress: false });
  };

  public render() {
    const { minimised, tokenPresent, mobileScreen } = this.props;
    const classes = classNames(this.props);
    const { loginInProgress } = this.state;

    return (
      <div className={classes.authenticationContainer}>
        {loginInProgress ? <div className={classes.spinnerContainer}>
          <Spinner className={classes.spinner} size={SpinnerSize.medium} />
          {!minimised && <Label>
            <FormattedMessage id='Signing you in...' />
          </Label>
          }
        </div>
          :
          mobileScreen ? showSignInButtonOrProfile(tokenPresent, mobileScreen, this.signIn, minimised) :
            <Stack>
              {!tokenPresent &&
                <>
                  <div className={classes.authenticationLayout}>

                    {!minimised && <Label className={classes.authenticationLabel}>
                      <Icon iconName='Permissions' className={classes.keyIcon} />
                      <FormattedMessage id='Authentication' />
                    </Label>
                    }
                    <Settings />
                  </div>

                  <br />
                  {!minimised && <Label>
                    <FormattedMessage id='Using demo tenant' /> <FormattedMessage id='To access your own data:' />
                  </Label>}
                </>
              }
              <span><br />{showSignInButtonOrProfile(tokenPresent, mobileScreen, this.signIn, minimised)}<br /> </span>
            </Stack>}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  const mobileScreen = !!state.sidebarProperties.mobileScreen;
  const showSidebar = !!state.sidebarProperties.showSidebar;
  return {
    tokenPresent: !!state.authToken,
    mobileScreen,
    appTheme: state.theme,
    minimised: !mobileScreen && !showSidebar
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
