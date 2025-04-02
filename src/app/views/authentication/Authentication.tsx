import { MessageBarType, Spinner, SpinnerSize, styled } from '@fluentui/react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { useState } from 'react';

import { authenticationWrapper } from '../../../modules/authentication';
import { getSignInAuthErrorHint, signInAuthError } from '../../../modules/authentication/authentication-error-hints';
import { AppDispatch, useAppDispatch, useAppSelector } from '../../../store';
import { componentNames, errorTypes, eventTypes, telemetry } from '../../../telemetry';
import { setQueryResponseStatus } from '../../services/slices/query-status.slice';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from '../../services/slices/auth.slice';
import { classNames } from '../classnames';
import { showSignInButtonOrProfile } from './auth-util-components';
import { authenticationStyles } from './Authentication.styles';
import { translateMessage } from '../../utils/translate-messages';

const Authentication = (props: any) => {
  const dispatch: AppDispatch = useAppDispatch();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const tokenPresent = !!authToken.token;
  const logoutInProgress = !!authToken.pending;

  const classes = classNames(props);

  const signIn = async (): Promise<void> => {
    setLoginInProgress(true);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SIGN_IN_BUTTON
    });

    try {
      const authResponse = await authenticationWrapper.logIn();
      if (authResponse) {
        setLoginInProgress(false);
        if (authResponse.accessToken) {
          dispatch(getAuthTokenSuccess());
        }
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
          statusText: translateMessage('Authentication failed'),
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

  const signInWithOther = async (): Promise<void> => {
    setLoginInProgress(true);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SIGN_IN_WITH_OTHER_ACCOUNT_BUTTON
    });
    try {
      const authResponse = await authenticationWrapper.logInWithOther();
      if (authResponse) {
        setLoginInProgress(false);
        if (authResponse.accessToken) {
          dispatch(getAuthTokenSuccess());
        }
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
      }
    } catch (error: any) {
      setLoginInProgress(false);
    }
  }


  const removeUnderScore = (statusString: string): string => {
    return statusString ? statusString.replace(/_/g, ' ') : statusString;
  }

  const showProgressSpinner = (): React.ReactNode => {
    return (
      <div className={classes.spinnerContainer}>
        <Spinner className={classes.spinner} size={SpinnerSize.medium} />
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
      ) : (
        <>
          {showSignInButtonOrProfile(
            tokenPresent,
            signIn,
            signInWithOther
          )}
        </>
      )}
    </>
  );
};

// @ts-ignore
const StyledAuthentication = styled(Authentication, authenticationStyles);
export default StyledAuthentication;
