
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Icon, Label, MessageBarType, Spinner, SpinnerSize, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { componentNames, errorTypes, telemetry } from '../../../telemetry';
import { IAuthenticationProps } from '../../../types/authentication';
import { Mode } from '../../../types/enums';
import * as authActionCreators from '../../services/actions/auth-action-creators';
import * as queryStatusActionCreators from '../../services/actions/query-status-action-creator';
import { logIn } from '../../services/graph-client/msal-service';
import { translateMessage } from '../../utils/translate-messages';
import { classNames } from '../classnames';
import { showSignInButtonOrProfile } from './auth-util-components';
import { authenticationStyles } from './Authentication.styles';

export class Authentication extends Component<IAuthenticationProps, { loginInProgress: boolean }> {
  constructor(props: IAuthenticationProps) {
    super(props);
    this.state = { loginInProgress: false };
  }

  public signIn = async (): Promise<void> => {
    const {
      intl: { messages },
    }: any = this.props;
    this.setState({ loginInProgress: true });

    try {
      const authResponse = await logIn();
      if (authResponse) {
        this.setState({ loginInProgress: false });

        this.props.actions!.signIn(authResponse.accessToken);
        this.props.actions!.storeScopes(authResponse.scopes);
      }
    } catch (error) {
      const { errorCode } = error;
      this.props.actions!.setQueryResponseStatus({
        ok: false,
        statusText: messages['Authentication failed'],
        status: errorCode === 'popup_window_error'
          ? translateMessage('popup blocked, allow pop-up windows in your browser')
          : errorCode ? errorCode.replace('_', ' ') : '',
        messageType: MessageBarType.error
      });
      this.setState({ loginInProgress: false });
      telemetry.trackException(
        new Error(errorTypes.OPERATIONAL_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.AUTHENTICATION_ACTION,
          Message: `Authentication failed: ${errorCode ? errorCode.replace('_', ' ') : ''}`,
        });
    }

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
              {!tokenPresent && graphExplorerMode === Mode.Complete && !minimised && showUnAuthenticatedText(classes)}
              <br />{showSignInButtonOrProfile(tokenPresent, mobileScreen, this.signIn, minimised)}<br />
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
    actions: bindActionCreators({
      ...authActionCreators,
      ...queryStatusActionCreators
    },
      dispatch)
  };
}

// @ts-ignore
const IntlAuthentication = injectIntl(Authentication);
// @ts-ignore
const StyledAuthentication = styled(IntlAuthentication, authenticationStyles);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledAuthentication);
