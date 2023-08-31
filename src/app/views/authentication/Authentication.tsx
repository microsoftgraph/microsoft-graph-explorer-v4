import { BrowserAuthError } from '@azure/msal-browser';
import { MessageBarType, Spinner, SpinnerSize, getTheme, mergeStyles } from '@fluentui/react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { useState } from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { authenticationWrapper } from '../../../modules/authentication';
import { getSignInAuthErrorHint, signInAuthError } from '../../../modules/authentication/authentication-error-hints';
import { AppDispatch, useAppSelector } from '../../../store';
import { componentNames, errorTypes, eventTypes, telemetry } from '../../../telemetry';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from '../../services/actions/auth-action-creators';
import { setQueryResponseStatus } from '../../services/actions/query-status-action-creator';
import { translateMessage } from '../../utils/translate-messages';
import { authenticationStyles } from './Authentication.styles';
import { showSignInButtonOrProfile } from './auth-util-components';

const Authentication = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { authToken } = useAppSelector((state) => state);
  const tokenPresent = !!authToken.token;
  const logoutInProgress = !!authToken.pending;
  const theme = getTheme();
  const spinnerContainer = mergeStyles(authenticationStyles(theme).spinnerContainer);
  const spinner = mergeStyles(authenticationStyles(theme).spinner);

  const signIn = async (): Promise<void> => {
    setLoginInProgress(true);
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.SIGN_IN_BUTTON
    });

    try {
      const authResponse = await authenticationWrapper.logIn();
      if (authResponse) {
        setLoginInProgress(false);
        dispatch(getAuthTokenSuccess(!!authResponse.accessToken));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
      }
    } catch (error: unknown) {
      const { errorCode } = error as BrowserAuthError;
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
        dispatch(getAuthTokenSuccess(!!authResponse.accessToken));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
      }
    } catch (error: unknown) {
      setLoginInProgress(false);
    }
  }


  const removeUnderScore = (statusString: string): string => {
    return statusString ? statusString.replace(/_/g, ' ') : statusString;
  }

  const showProgressSpinner = (): React.ReactNode => {
    return (
      <div className={spinnerContainer}>
        <Spinner className={spinner} size={SpinnerSize.medium} />
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
const IntlAuthentication = injectIntl(Authentication);
export default IntlAuthentication;
