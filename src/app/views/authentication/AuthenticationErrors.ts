import { authenticationWrapper } from "../../../modules/authentication";
import { translateMessage } from "../../utils/translate-messages";

const AuthErrorList : string[] = ['user_cancelled','null_or_empty_id_token',
"authorization_code_missing_from_server_response",
'no_tokens_found', 'invalid_request', "user_login_error","nonce_mismatch_error",
'login_progress_error', 'interaction_in_progress',
'interaction_required', 'invalid_grant', 'endpoints_resolution_error']

const ScopeErrorList : string[] = ['interaction_required', 'consent_required', 'login_required', 'access_denied', 'user_cancelled' ]

export function getSignInAuthError(error: string): string{
    const authErrorAvailable = checkIfSignInAuthError(error);
    if(authErrorAvailable){
      clearCache();
    }
    return error.replace(/_/g, ' ') + '      ' + ((authErrorAvailable === true) ?( translateMessage('Tip') + ':  ' + translateMessage(error)) : translateMessage(error));
}

export function checkIfSignInAuthError(error: string): boolean {
    return AuthErrorList.includes(error.trim());
}

export function getConsentAuthError(error: string): string{
    const authErrorAvailable = ScopeErrorList.includes(error);
    const consentErrorStringTip = error + '_consent';
    return error.replace(/_/g, ' ') + '      ' + ((authErrorAvailable === true) ?( translateMessage('Tip') + ':  ' + translateMessage(consentErrorStringTip)) : translateMessage(error));
}


const clearCache = (): void => {
    authenticationWrapper.clearCache();
    authenticationWrapper.deleteHomeAccountId();
    window.sessionStorage.clear();
}