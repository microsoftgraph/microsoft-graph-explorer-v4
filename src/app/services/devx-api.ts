import { authenticationWrapper } from '../../modules/authentication';
import { IDevxAPI } from '../../types/devx-api';

export function normalizeDevxUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || /[?#]/.test(value)) {
      return null;
    }
    const normalized = url.toString();
    let end = normalized.length;
    while (end > 0 && normalized[end - 1] === '/') {
      end--;
    }
    return normalized.slice(0, end);
  } catch {
    return null;
  }
}

export function getDevxAccount(authenticated: boolean) {
  const account = authenticated ? authenticationWrapper.getAccount() : undefined;
  return {
    accountKey: account ? `${account.homeAccountId}:${account.tenantId}` : '',
    eligible: !!account && /^[^@\s]+@microsoft\.com$/i.test(account.username)
  };
}

export function defaultDevxConfiguration(): IDevxAPI {
  return { baseUrl: process.env.REACT_APP_DEVX_API_URL || '', custom: false };
}

export function getDevxConfiguration(state: {
  devxApi: IDevxAPI;
  auth?: { authToken: { token: unknown } };
}): IDevxAPI {
  const account = getDevxAccount(!!state.auth?.authToken.token);
  const config = state.devxApi;
  if (config.custom && account.eligible && config.accountKey === account.accountKey &&
    config.org?.trim() && config.branchName?.trim() && normalizeDevxUrl(config.baseUrl)) {
    return { ...config };
  }
  return defaultDevxConfiguration();
}

export function devxCacheKey(config: IDevxAPI = defaultDevxConfiguration()): string {
  return `devx-v3:${JSON.stringify([
    config.custom ? 'custom' : 'default', config.baseUrl, config.org || '', config.branchName || ''
  ])}:`;
}

type DevxEndpoint = '/samples' | '/permissions' | '/openapi/tree' | '/openapi' | '/api/graphexplorersnippets';

export function fetchDevxApi(config: IDevxAPI, endpoint: DevxEndpoint,
  parameters: Record<string, string> = {}, options: RequestInit = {}) {
  const url = new URL(`${config.baseUrl}${endpoint}`);
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, value));
  if (config.custom && (endpoint === '/samples' || endpoint === '/permissions')) {
    url.searchParams.set('org', config.org!);
    url.searchParams.set('branchName', config.branchName!);
  }
  return fetch(url.toString(), { ...options, redirect: 'error' });
}
