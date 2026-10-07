import {
  getSignInAuthErrorHint,
  signInAuthError,
  getConsentAuthErrorHint,
  scopeAuthError
} from './authentication-error-hints';

describe('authentication-error-hints', () => {
  describe('signInAuthError', () => {
    it('should return true for user_cancelled', () => {
      expect(signInAuthError('user_cancelled')).toBe(true);
    });

    it('should return true for interaction_in_progress', () => {
      expect(signInAuthError('interaction_in_progress')).toBe(true);
    });

    it('should return true for interaction_required', () => {
      expect(signInAuthError('interaction_required')).toBe(true);
    });

    it('should return true for login_progress_error', () => {
      expect(signInAuthError('login_progress_error')).toBe(true);
    });

    it('should return false for unknown error', () => {
      expect(signInAuthError('some_unknown_error')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(signInAuthError('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(signInAuthError(null as any)).toBe(false);
      expect(signInAuthError(undefined as any)).toBe(false);
    });
  });

  describe('scopeAuthError', () => {
    it('should return true for interaction_required', () => {
      expect(scopeAuthError('interaction_required')).toBe(true);
    });

    it('should return true for consent_required', () => {
      expect(scopeAuthError('consent_required')).toBe(true);
    });

    it('should return true for user_cancelled', () => {
      expect(scopeAuthError('user_cancelled')).toBe(true);
    });

    it('should return true for access_denied', () => {
      expect(scopeAuthError('access_denied')).toBe(true);
    });

    it('should return false for unknown error', () => {
      expect(scopeAuthError('some_unknown_error')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(scopeAuthError('')).toBe(false);
    });
  });

  describe('getSignInAuthErrorHint', () => {
    it('should return a hint for known auth errors', () => {
      const hint = getSignInAuthErrorHint('user_cancelled');
      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
    });

    it('should return empty string for unknown error', () => {
      const hint = getSignInAuthErrorHint('completely_unknown');
      expect(hint).toBe('');
    });
  });

  describe('getConsentAuthErrorHint', () => {
    it('should return a hint for known scope errors', () => {
      const hint = getConsentAuthErrorHint('consent_required');
      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(0);
    });

    it('should return empty string for unknown error', () => {
      const hint = getConsentAuthErrorHint('completely_unknown');
      expect(hint).toBe('');
    });
  });
});
