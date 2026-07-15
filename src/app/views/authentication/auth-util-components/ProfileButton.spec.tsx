jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../main-header/utils', () => ({
  useHeaderStyles: () => ({ iconButton: 'mock-icon-button' })
}));

const mockRevokeScopes: any = jest.fn(() => ({ type: 'revoke/mock' }));
mockRevokeScopes.pending = 'revokeScopes/pending';
mockRevokeScopes.fulfilled = 'revokeScopes/fulfilled';
mockRevokeScopes.rejected = 'revokeScopes/rejected';
jest.mock('../../../services/actions/revoke-scopes.action', () => ({
  revokeScopes: mockRevokeScopes
}));
jest.mock('../../../services/slices/profile.slice', () => ({
  getProfileInfo: jest.fn(() => ({ type: 'profile/get' }))
}));
jest.mock('../../../services/hooks/usePopups', () => ({
  usePopups: () => ({ show: jest.fn() })
}));
jest.mock('../../../services/hooks', () => ({
  usePopups: () => ({ show: jest.fn() })
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../test-utils';
import { PersonaSignIn, showSignInButtonOrProfile } from './ProfileButton';

describe('ProfileButton', () => {
  describe('PersonaSignIn', () => {
    it('renders persona with offline presence', () => {
      renderWithProviders(<PersonaSignIn />, {
        preloadedState: {
          profile: {
            status: 'success',
            user: { id: '1', displayName: 'Test', emailAddress: 'test@t.com', profileImageUrl: '' },
            error: null
          }
        }
      });
      // PersonaSignIn renders a Persona element
      expect(document.querySelector('[aria-hidden="true"]')).toBeTruthy();
    });
  });

  describe('showSignInButtonOrProfile', () => {
    it('shows sign-in button when token not present', () => {
      const signIn = jest.fn();
      const signInWithOther = jest.fn().mockResolvedValue(undefined);

      renderWithProviders(
        <>{showSignInButtonOrProfile(false, signIn, signInWithOther)}</>,
        {
          preloadedState: {
            profile: {
              status: 'success',
              user: { id: '1', displayName: 'Test', emailAddress: 'a@b.com', profileImageUrl: '' },
              error: null
            }
          }
        }
      );
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('calls signIn when sign-in button clicked', () => {
      const signIn = jest.fn();
      const signInWithOther = jest.fn().mockResolvedValue(undefined);

      renderWithProviders(
        <>{showSignInButtonOrProfile(false, signIn, signInWithOther)}</>,
        {
          preloadedState: {
            profile: {
              status: 'success',
              user: { id: '1', displayName: 'Test', emailAddress: 'a@b.com', profileImageUrl: '' },
              error: null
            }
          }
        }
      );
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(signIn).toHaveBeenCalled();
    });

    it('shows profile when token is present', () => {
      const signIn = jest.fn();
      const signInWithOther = jest.fn().mockResolvedValue(undefined);

      renderWithProviders(
        <>{showSignInButtonOrProfile(true, signIn, signInWithOther)}</>,
        {
          preloadedState: {
            auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
            profile: {
              status: 'success',
              user: { id: '1', displayName: 'Signed In User', emailAddress: 'a@b.com', profileImageUrl: '' },
              error: null
            }
          }
        }
      );
      // Profile component should render (not sign-in button)
      expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
    });
  });
});
