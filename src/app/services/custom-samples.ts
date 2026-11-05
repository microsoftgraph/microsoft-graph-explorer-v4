import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, ApplicationState } from '../../store';
import { translateMessage } from '../utils/translate-messages';
import { defaultDevxConfiguration, getDevxAccount, normalizeDevxUrl } from './devx-api';
import { devxConfigurationChanged } from './devx-events';
import { fetchSamples, loadSamples } from './slices/samples.slice';
import { fetchResources, loadResources } from './slices/resources.slice';

export interface CustomSamplesInput {
  baseUrl?: string;
  org: string;
  branchName: string;
}

export const applyCustomSamples = createAsyncThunk<void, CustomSamplesInput, {
  state: ApplicationState; rejectValue: string;
}>('devxApi/applyCustomSamples', async (input, { getState, dispatch, requestId, rejectWithValue, signal }) => {
  const state = getState();
  const account = getDevxAccount(!!state.auth.authToken.token);
  const baseUrl = input.baseUrl?.trim() ? normalizeDevxUrl(input.baseUrl) : defaultDevxConfiguration().baseUrl;
  if (!account.eligible) { return rejectWithValue(translateMessage('Custom samples unavailable')); }
  if (!baseUrl || !input.org.trim() || !input.branchName.trim()) {
    return rejectWithValue(translateMessage('Invalid custom samples settings'));
  }
  const configuration = {
    baseUrl, org: input.org.trim(), branchName: input.branchName.trim(),
    custom: true, ...account, revision: (state.devxApi.revision || 0) + 1
  };
  try {
    const [samples, resources] = await Promise.all([
      loadSamples(configuration, signal), loadResources(configuration, true, signal)
    ]);
    const current = getState();
    const currentAccount = getDevxAccount(!!current.auth.authToken.token);
    if (signal.aborted || !current.devxApi.pending || !currentAccount.eligible ||
      currentAccount.accountKey !== account.accountKey ||
      current.devxApi.requestId !== requestId || current.devxApi.revision !== state.devxApi.revision) {
      return rejectWithValue(translateMessage('Custom samples cancelled'));
    }
    dispatch(devxConfigurationChanged({ configuration, samples, resources }));
  } catch {
    return rejectWithValue(translateMessage('Custom samples loading failed'));
  }
}, {
  condition: (_, { getState }) => !getState().devxApi.pending
});

export function resetCustomSamples() {
  return (dispatch: AppDispatch, getState: () => ApplicationState) => {
    const state = getState();
    dispatch(devxConfigurationChanged({
      configuration: {
        ...defaultDevxConfiguration(),
        ...getDevxAccount(!!state.auth.authToken.token),
        revision: (state.devxApi.revision || 0) + 1
      }
    }));
    dispatch(fetchSamples());
    dispatch(fetchResources());
  };
}
