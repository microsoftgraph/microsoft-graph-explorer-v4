import { Icon, Label, Spinner, SpinnerSize, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { FormattedMessage } from 'react-intl';
import { IAuthenticationProps } from '../../../types/authentication';
import { Mode } from '../../../types/enums';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import { logIn } from '../../services/graph-client/msal-service';
import { classNames } from '../classnames';
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
    const { minimised, tokenPresent, mobileScreen, graphExplorerMode } = this.props;
    const classes = classNames(this.props);
    const { loginInProgress } = this.state;

    return (
      <>
        {loginInProgress ? showLoginInProgressSpinner(classes, minimised)
          :
          mobileScreen ? showSignInButtonOrProfile(tokenPresent, mobileScreen, this.signIn, minimised) :
            <>
              {!tokenPresent && graphExplorerMode === Mode.Complete && showUnAuthenticatedText(classes)}
              <span><br />{showSignInButtonOrProfile(tokenPresent, mobileScreen, this.signIn, minimised)}<br /> </span>
            </>}
      </>
    );
  }
}

function showUnAuthenticatedText(classes: any): React.ReactNode {
  return <>
    <Label className={classes.authenticationLabel}>
      <Icon iconName='Permissions' className={classes.keyIcon} />
      <FormattedMessage id='Authentication' />
    </Label>

    <br />
    <Label>
      <FormattedMessage id='Using demo tenant' /> <FormattedMessage id='To access your own data:' />
    </Label>
  </>;
}

function showLoginInProgressSpinner(classes: any, minimised: boolean): React.ReactNode {
  return <div className={classes.spinnerContainer}>
    <Spinner className={classes.spinner} size={SpinnerSize.medium} />
    {!minimised && <Label>
      <FormattedMessage id='Signing you in...' />
    </Label>}
  </div>;
}

function mapStateToProps(state: any) {
  const mobileScreen = !!state.sidebarProperties.mobileScreen;
  const showSidebar = !!state.sidebarProperties.showSidebar;
  return {
    tokenPresent: !!state.authToken,
    mobileScreen,
    appTheme: state.theme,
    minimised: !mobileScreen && !showSidebar,
    graphExplorerMode: state.graphExplorerMode
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
