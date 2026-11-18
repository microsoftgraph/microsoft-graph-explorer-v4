import { LoginType } from '../../types/enums';

/**
 * Returns whether to load the POPUP/REDIRECT interaction
 * @returns string
 */
export function getLoginType(): LoginType {
  const userAgent = window.navigator.userAgent;
  const msie = userAgent.indexOf('MSIE ');
  const msie11 = userAgent.indexOf('Trident/');
  const msedge = userAgent.indexOf('Edge/');
  const isIE = msie > 0 || msie11 > 0;
  const isEdge = msedge > 0;
  return isIE || isEdge ? LoginType.Redirect : LoginType.Popup;
}

const REDIRECT_BRIDGE_FILENAME = 'redirect.html';

/**
 * Redirect URI of the MSAL v5 redirect bridge page, which must be same-origin with the app.
 * Host pages that don't serve the bridge from the origin root set window.RedirectUri
 * (mirroring window.ClientId).
 */
export function getRedirectBridgeUri(): string {
  return window.RedirectUri || `${window.location.origin}/${REDIRECT_BRIDGE_FILENAME}`;
}
