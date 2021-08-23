import { translateMessage } from "../../utils/translate-messages";

const AuthErrorList : string[] = ['user_cancelled','null_or_empty_id_token',
"authorization_code_missing_from_server_response",
'no_tokens_found', 'invalid_request', "user_login_error","nonce_mismatch_error",
'login_progress_error', 'interaction_in_progress',
'interaction_required', 'invalid_grant', 'endpoints_resolution_error']

const ScopeErrorList : string[] = ['interaction_required', 'consent_required', 'login_required', 'access_denied', 'user_cancelled' ]

export function getSignInAuthErrorHint(error: string): string{
    const authErrorHintAvailable = signInAuthError(error);
    return getHint(authErrorHintAvailable, error);
}

export function signInAuthError(error: string): boolean {
    return AuthErrorList.includes(error.trim());
}

export function getConsentAuthErrorHint(error: string): string{
    const authErrorHintAvailable = scopeAuthError(error);
    const consentErrorHint = error + '_consent';
    return getHint(authErrorHintAvailable, consentErrorHint);
}

export function scopeAuthError(error: string): boolean {
    return ScopeErrorList.includes(error);
}

function getHint(errorHintAvailable: boolean, error: string): string {
    return ((errorHintAvailable === true) ? ( translateMessage('Tip') + ' -  ' + translateMessage(error) ) : translateMessage(error));
}