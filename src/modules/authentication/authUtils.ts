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

/**
 * get current uri for redirect uri purpose
 * ref - https://github.com/AzureAD/microsoft-authentication-library-for
 * -js/blob/9274fac6d100a6300eb2faa4c94aa2431b1ca4b0/lib/msal-browser/src/utils/BrowserUtils.ts#L49
*/
export function getCurrentUri(): string {
  const currentUrl = window.location.href.split('?')[0].split('#')[0] + 'blank.html';
  return currentUrl.toLowerCase() ;
}
