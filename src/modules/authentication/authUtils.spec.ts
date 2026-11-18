import { LoginType } from '../../types/enums';
import { getLoginType, getRedirectBridgeUri } from './authUtils';

describe('Auth utils should', () => {
  afterEach(() => {
    window.RedirectUri = undefined;
  });

  it('return valid login type', () => {
    expect(getLoginType()).toBe(LoginType.Popup);
  })

  it('default the redirect bridge to redirect.html on the current origin', () => {
    expect(getRedirectBridgeUri()).toBe(`${window.location.origin}/redirect.html`);
  })

  it('use the redirect bridge uri provided by the host page', () => {
    window.RedirectUri = 'https://developer.microsoft.com/graph/graph-explorer/redirect.html';
    expect(getRedirectBridgeUri()).toBe('https://developer.microsoft.com/graph/graph-explorer/redirect.html');
  })
})
