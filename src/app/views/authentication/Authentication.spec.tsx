import '@testing-library/jest-dom';
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWithProviders } from '../../../test-utils';
import Authentication from './Authentication';

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn()
  }
}));
jest.mock('../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn().mockReturnValue('hint'),
  signInAuthError: jest.fn().mockReturnValue(false)
}));
jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackException: jest.fn() },
  componentNames: {
    SIGN_IN_BUTTON: 'sign-in',
    SIGN_IN_WITH_OTHER_ACCOUNT_BUTTON: 'other',
    AUTHENTICATION_ACTION: 'auth'
  },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn' },
  errorTypes: { OPERATIONAL_ERROR: 'op-error' }
}));
jest.mock('./auth-util-components/ProfileButton', () => ({
  showSignInButtonOrProfile: jest.fn(
    (tokenPresent: boolean, signIn: () => void, signInWithOther: () => void) =>
      tokenPresent
        ? <div data-testid="profile">
            Profile
            <button data-testid="sign-in-other-btn" onClick={signInWithOther}>Other</button>
          </div>
        : <button data-testid="sign-in-btn" onClick={signIn}>Sign In</button>
  )
}));
jest.mock('@fluentui/react-components', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>
}));

describe('Authentication component', () => {
  beforeEach(() => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    const { signInAuthError } = require('../../../modules/authentication/authentication-error-hints');
    authenticationWrapper.logIn.mockReset();
    authenticationWrapper.logInWithOther.mockReset();
    authenticationWrapper.clearSession.mockReset();
    signInAuthError.mockReturnValue(false);
  });

  it('renders sign-in button when not authenticated', () => {
    renderWithProviders(<Authentication />);
    expect(screen.getByTestId('sign-in-btn')).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('shows profile when authenticated', () => {
    renderWithProviders(<Authentication />, {
      preloadedState: {
        auth: {
          authToken: { token: true, pending: false },
          consentedScopes: []
        }
      }
    });
    expect(screen.getByTestId('profile')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('shows spinner when logout is in progress', () => {
    renderWithProviders(<Authentication />, {
      preloadedState: {
        auth: {
          authToken: { token: true, pending: true },
          consentedScopes: []
        }
      }
    });
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('shows spinner during sign in', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    // Make logIn return a pending promise
    authenticationWrapper.logIn.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('handles successful sign in', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.logIn.mockResolvedValue({
      accessToken: 'test-token',
      scopes: ['User.Read']
    });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(authenticationWrapper.logIn).toHaveBeenCalled();
    });
  });

  it('handles sign in error', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.logIn.mockRejectedValue({ errorCode: 'user_cancelled' });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    // After error, should show sign-in button again (login is no longer in progress)
    await screen.findByTestId('sign-in-btn');
    expect(authenticationWrapper.logIn).toHaveBeenCalled();
  });

  it('handles sign in error that clears session', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    const { signInAuthError } = require('../../../modules/authentication/authentication-error-hints');
    signInAuthError.mockReturnValue(true);
    authenticationWrapper.logIn.mockRejectedValue({ errorCode: 'interaction_in_progress' });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await screen.findByTestId('sign-in-btn');
    expect(authenticationWrapper.clearSession).toHaveBeenCalled();
  });

  it('handles sign in with null authResponse - shows spinner', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.logIn.mockResolvedValue(null);

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    // When authResponse is null, loginInProgress remains true (spinner shows)
    await waitFor(() => {
      expect(authenticationWrapper.logIn).toHaveBeenCalled();
    });
    // Spinner should be showing since setLoginInProgress(false) is inside if(authResponse)
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('handles successful sign in without accessToken', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.logIn.mockResolvedValue({
      accessToken: '',
      scopes: ['User.Read']
    });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(authenticationWrapper.logIn).toHaveBeenCalled();
    });
  });

  it('tracks telemetry event on sign in click', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    const { telemetry } = require('../../../telemetry');
    authenticationWrapper.logIn.mockResolvedValue({ accessToken: 'tok', scopes: [] });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', expect.objectContaining({
        ComponentName: 'sign-in'
      }));
    });
  });

  it('tracks exception telemetry on sign in error', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    const { telemetry } = require('../../../telemetry');
    const { signInAuthError } = require('../../../modules/authentication/authentication-error-hints');
    signInAuthError.mockReturnValue(false);
    authenticationWrapper.logIn.mockRejectedValue({ errorCode: 'some_error' });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(telemetry.trackException).toHaveBeenCalled();
    });
  });

  it('handles sign in error with no errorCode', async () => {
    const { authenticationWrapper } = require('../../../modules/authentication');
    const { signInAuthError } = require('../../../modules/authentication/authentication-error-hints');
    signInAuthError.mockReturnValue(false);
    authenticationWrapper.logIn.mockRejectedValue({ errorCode: undefined });

    renderWithProviders(<Authentication />);
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await screen.findByTestId('sign-in-btn');
    expect(authenticationWrapper.logIn).toHaveBeenCalled();
  });

  describe('signInWithOther', () => {
    it('handles successful signInWithOther with accessToken', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.logInWithOther.mockResolvedValue({
        accessToken: 'other-token',
        scopes: ['Mail.Read']
      });

      renderWithProviders(<Authentication />, {
        preloadedState: {
          auth: { authToken: { token: true, pending: false }, consentedScopes: [] }
        }
      });
      fireEvent.click(screen.getByTestId('sign-in-other-btn'));

      await waitFor(() => {
        expect(authenticationWrapper.logInWithOther).toHaveBeenCalled();
      });
    });

    it('handles signInWithOther returning null', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.logInWithOther.mockResolvedValue(null);

      renderWithProviders(<Authentication />, {
        preloadedState: {
          auth: { authToken: { token: true, pending: false }, consentedScopes: [] }
        }
      });
      fireEvent.click(screen.getByTestId('sign-in-other-btn'));

      await waitFor(() => {
        expect(authenticationWrapper.logInWithOther).toHaveBeenCalled();
      });
      // loginInProgress stays true, spinner shows
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('handles signInWithOther without accessToken', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.logInWithOther.mockResolvedValue({
        accessToken: '',
        scopes: ['User.Read']
      });

      renderWithProviders(<Authentication />, {
        preloadedState: {
          auth: { authToken: { token: true, pending: false }, consentedScopes: [] }
        }
      });
      fireEvent.click(screen.getByTestId('sign-in-other-btn'));

      await waitFor(() => {
        expect(authenticationWrapper.logInWithOther).toHaveBeenCalled();
      });
    });

    it('handles signInWithOther error', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      authenticationWrapper.logInWithOther.mockRejectedValue({ errorCode: 'cancelled' });

      renderWithProviders(<Authentication />, {
        preloadedState: {
          auth: { authToken: { token: true, pending: false }, consentedScopes: [] }
        }
      });
      fireEvent.click(screen.getByTestId('sign-in-other-btn'));

      await waitFor(() => {
        expect(authenticationWrapper.logInWithOther).toHaveBeenCalled();
      });
      // After error, loginInProgress is set to false
      await screen.findByTestId('profile');
    });

    it('tracks telemetry on signInWithOther', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      const { telemetry } = require('../../../telemetry');
      authenticationWrapper.logInWithOther.mockResolvedValue({ accessToken: 'tok', scopes: [] });

      renderWithProviders(<Authentication />, {
        preloadedState: {
          auth: { authToken: { token: true, pending: false }, consentedScopes: [] }
        }
      });
      fireEvent.click(screen.getByTestId('sign-in-other-btn'));

      await waitFor(() => {
        expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', expect.objectContaining({
          ComponentName: 'other'
        }));
      });
    });
  });
});
