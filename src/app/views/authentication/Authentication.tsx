import { Spinner } from '@fluentui/react-components';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { useState } from 'react';

import { authenticationWrapper } from '../../../modules/authentication';
import { getSignInAuthErrorHint, signInAuthError } from '../../../modules/authentication/authentication-error-hints';
import { AppDispatch, useAppDispatch, useAppSelector } from '../../../store';
import { componentNames, errorTypes, eventTypes, telemetry } from '../../../telemetry';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from '../../services/slices/auth.slice';
import { setQueryResponseStatus } from '../../services/slices/query-status.slice';
import { translateMessage } from '../../utils/translate-messages';
import { showSignInButtonOrProfile } from './auth-util-components/ProfileButton';

const showProgressSpinner = (): React.ReactNode => {
  return (
    <Spinner/>
  );
};

const removeUnderScore = (statusString: string): string => {
  return statusString ? statusString.replace(/_/g, ' ') : statusString;
}


const Authentication = (props: any) => {
  const dispatch: AppDispatch = useAppDispatch();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const tokenPresent = !!authToken.token;
  const logoutInProgress = !!authToken.pending;

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
          messageBarType: 'error',
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

export default Authentication;
