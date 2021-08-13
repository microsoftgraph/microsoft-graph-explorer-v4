import { SeverityLevel } from '@microsoft/applicationinsights-web';
import {
  Icon,
  Label,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  styled,
} from 'office-ui-fabric-react';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { authenticationWrapper } from '../../../modules/authentication';

import { componentNames, errorTypes, telemetry } from '../../../telemetry';
import { Mode } from '../../../types/enums';
import { IRootState } from '../../../types/root';
import {
  getAuthTokenSuccess,
  getConsentedScopesSuccess,
} from '../../services/actions/auth-action-creators';
import { setQueryResponseStatus } from '../../services/actions/query-status-action-creator';
import { HOME_ACCOUNT_KEY } from '../../services/graph-constants';
import { translateMessage } from '../../utils/translate-messages';
import { classNames } from '../classnames';
import { showSignInButtonOrProfile } from './auth-util-components';
import { authenticationStyles } from './Authentication.styles';
import { AuthErrorList } from './AuthenticationErrorList';

const Authentication = (props: any) => {
  const dispatch = useDispatch();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { sidebarProperties, authToken, graphExplorerMode } = useSelector(
    (state: IRootState) => state
  );
  const mobileScreen = !!sidebarProperties.mobileScreen;
  const showSidebar = !!sidebarProperties.showSidebar;
  const tokenPresent = !!authToken.token;
  const logoutInProgress = !!authToken.pending;
  const minimised = !mobileScreen && !showSidebar;

  const classes = classNames(props);

  const {
    intl: { messages },
  }: any = props;
  const signIn = async (): Promise<void> => {
    setLoginInProgress(true);

    try {
      const authResponse = await authenticationWrapper.logIn();
      authResponse.account = null;
      // eslint-disable-next-line no-debugger
      debugger;
      if (authResponse) {
        setLoginInProgress(false);
        dispatch(getAuthTokenSuccess(!!authResponse.accessToken));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
      }
    } catch (error) {
      const { errorCode } = error;
      dispatch(
        setQueryResponseStatus({
          ok: false,
          statusText: messages['Authentication failed'],
          status: getErrorAndHint(errorCode),
          messageType: MessageBarType.error,
        })
      );
      setLoginInProgress(false);
      telemetry.trackException(
        new Error(errorTypes.OPERATIONAL_ERROR),
        SeverityLevel.Error,
        {
          ComponentName: componentNames.AUTHENTICATION_ACTION,
          Message: `Authentication failed: ${
            errorCode ? errorCode.replace('_', ' ') : ''
          }`,
        }
      );
    }
  };

  const getErrorAndHint = (errorCode: string): string => {
    const errorMessageHint : string = translateMessage(errorCode);
    if(AuthErrorList.filter(error => error === errorCode)) {
      deleteHomeAccountId();
    }
    return errorCode.replace('_', ' ') + '      Tip: ' + errorMessageHint;
  };

  const deleteHomeAccountId = () : void => {
    // eslint-disable-next-line no-console
    console.log('Deleting home account ID');
    // eslint-disable-next-line no-console
    console.log('Home account id', localStorage.getItem(HOME_ACCOUNT_KEY));
    localStorage.removeItem(HOME_ACCOUNT_KEY);
  }


  const showProgressSpinner = (): React.ReactNode => {
    return (
      <div className={classes.spinnerContainer}>
        <Spinner className={classes.spinner} size={SpinnerSize.medium} />
        {!minimised && (
          <Label>
            <FormattedMessage
              id={`Signing you ${loginInProgress ? 'in' : 'out'}...`}
            />
          </Label>
        )}
      </div>
    );
  };

  const showUnAuthenticatedText = (): React.ReactNode => {
    return (
      <>
        <Label className={classes.authenticationLabel}>
          <Icon iconName='Permissions' className={classes.keyIcon} />
          <FormattedMessage id='Authentication' />
        </Label>

        <br />
        <MessageBar messageBarType={MessageBarType.warning} isMultiline={true}>
          <FormattedMessage id='Using demo tenant' />{' '}
          <FormattedMessage id='To access your own data:' />
        </MessageBar>
      </>
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
        showSignInButtonOrProfile(tokenPresent, mobileScreen, signIn, minimised)
      ) : (
        <>
          {!tokenPresent &&
            graphExplorerMode === Mode.Complete &&
            !minimised &&
            showUnAuthenticatedText()}
          <br />
          {showSignInButtonOrProfile(
            tokenPresent,
            mobileScreen,
            signIn,
            minimised
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
