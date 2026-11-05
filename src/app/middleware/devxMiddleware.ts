import { Middleware } from '@reduxjs/toolkit';
import type { AppDispatch, ApplicationState } from '../../store';
import { resetCustomSamples } from '../services/custom-samples';
import { getDevxAccount } from '../services/devx-api';
import { devxAccountSynced } from '../services/devx-events';

const authActions = new Set([
  'auth/getAuthTokenSuccess', 'auth/signOutSuccess', 'auth/getConsentedScopesSuccess'
]);

const devxMiddleware: Middleware = api => next => action => {
  const result = next(action);
  if (authActions.has((action as { type: string }).type)) {
    const state = api.getState() as ApplicationState;
    const account = getDevxAccount(!!state.auth.authToken.token);
    if (account.accountKey !== state.devxApi.accountKey || account.eligible !== state.devxApi.eligible) {
      if (state.devxApi.custom) {
        (api.dispatch as AppDispatch)(resetCustomSamples());
      } else {
        api.dispatch(devxAccountSynced(account));
      }
    }
  }
  return result;
};

export default devxMiddleware;
