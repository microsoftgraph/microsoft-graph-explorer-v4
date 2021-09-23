import { translateMessage } from '../../utils/translate-messages';

const authErrorList: string[] = ['user_cancelled', 'null_or_empty_id_token',
  'authorization_code_missing_from_server_response',
  'no_tokens_found', 'invalid_request', 'user_login_error', 'nonce_mismatch_error',
  'login_progress_error', 'interaction_in_progress',
  'interaction_required', 'invalid_grant', 'endpoints_resolution_error', 'monitor_window_timeout']

const scopeErrorList: string[] = ['interaction_required', 'consent_required',
  'login_required', 'access_denied', 'user_cancelled']

export function getSignInAuthErrorHint(error: string): string {
  const authErrorHintAvailable = signInAuthError(error);
  return authErrorHintAvailable ? getHint(error) : '';
}

export function signInAuthError(error: string): boolean {
  return authErrorList.includes(error.trim());
}

export function getConsentAuthErrorHint(error: string): string {
  const authErrorHintAvailable = scopeAuthError(error);
  const consentError = error + '_consent';
  return authErrorHintAvailable ? getHint(consentError) : '';
}

export function scopeAuthError(error: string): boolean {
  return scopeErrorList.includes(error);
}

function getHint(error: string): string {
  return translateMessage('Tip') + ' -  ' + translateMessage(error);
}