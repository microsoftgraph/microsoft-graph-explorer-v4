import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Label, MessageBarType, Spinner, SpinnerSize, styled } from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { authenticationWrapper } from '../../../modules/authentication';
import { componentNames, errorTypes, telemetry } from '../../../telemetry';
import { IRootState } from '../../../types/root';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from '../../services/actions/auth-action-creators';
import { setQueryResponseStatus } from '../../services/actions/query-status-action-creator';
import { classNames } from '../classnames';
import { showSignInButtonOrProfile } from './auth-util-components';
import { authenticationStyles } from './Authentication.styles';
import { getSignInAuthErrorHint, signInAuthError } from '../../../modules/authentication/authentication-error-hints';

const Authentication = (props: any) => {
  const dispatch = useDispatch();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { sidebarProperties, authToken } = useSelector(
    (state: IRootState) => state
  );
  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;
  const tokenPresent = !!authToken.token;
  const logoutInProgress = !!authToken.pending;
  const minimised = !mobileScreen && !showSidebar;

  const classes = classNames(props);

  const {
    intl: { messages }
  }: any = props;
  const signIn = async (): Promise<void> => {
    setLoginInProgress(true);

    try {
      const authResponse = await authenticationWrapper.logIn();
      if (authResponse) {
        setLoginInProgress(false);
        dispatch(getAuthTokenSuccess(!!authResponse.accessToken));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
      }
    } catch (error: any) {
      const { errorCode } = error;
      if (signInAuthError(errorCode)) {
        authenticationWrapper.clearSession();
      }
      dispatch(
        setQueryResponseStatus({
          ok: false,
          statusText: messages['Authentication failed'],
          status: removeUnderScore(errorCode),
          messageType: MessageBarType.error,
          hint: getSignInAuthErrorHint(errorCode)
        })
      );
      setLoginInProgress(false);
      telemetry.trackException(
        new Error(errorTypes.OPERATIONAL_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.AUTHENTICATION_ACTION,
          Message: `Authentication failed: ${errorCode ? removeUnderScore(errorCode) : ''}`
        }
      );
    }
  };

  const removeUnderScore = (statusString: string): string => {
    return statusString ? statusString.replace(/_/g, ' ') : statusString;
  }

  const showProgressSpinner = (): React.ReactNode => {
    return (
      <div className={classes.spinnerContainer}>
        <Spinner className={classes.spinner} size={SpinnerSize.medium} />
        {!minimised && (
          <Label styles={{ root: { position: 'relative', top: '8px'}}} >
            <FormattedMessage
              id={`Signing you ${loginInProgress ? 'in' : 'out'}...`}
            />
          </Label>
        )}
      </div>
    );
  };

  if (logoutInProgress) {
    return showProgressSpinner();
  }

  return (
    <>
      {loginInProgress ? (
        showProgressSpinner()
      ) : mobileScreen ? (
        showSignInButtonOrProfile(tokenPresent, mobileScreen, signIn)
      ) : (
        <>
          <br />
          {showSignInButtonOrProfile(
            tokenPresent,
            mobileScreen,
            signIn
          )}
          <br />
        </>
      )}
    </>
  );
};

// @ts-ignore
const IntlAuthentication = injectIntl(Authentication);
// @ts-ignore
const StyledAuthentication = styled(IntlAuthentication, authenticationStyles);
export default StyledAuthentication;
