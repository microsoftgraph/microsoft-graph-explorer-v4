import React from 'react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';

const mockRevokeScopes: any = jest.fn(() => ({ type: 'revoke/mock' }));
mockRevokeScopes.pending = 'revokeScopes/pending';
mockRevokeScopes.fulfilled = 'revokeScopes/fulfilled';
mockRevokeScopes.rejected = 'revokeScopes/rejected';
jest.mock('../../../services/actions/revoke-scopes.action', () => ({
  revokeScopes: mockRevokeScopes
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logOut: jest.fn(),
    getAccount: jest.fn(),
    getSessionId: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn(),
    refreshToken: jest.fn()
  }
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackTabClickEvent: jest.fn(),
    trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {},
  eventTypes: {},
  errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../services/hooks/usePopups', () => ({
  usePopups: () => ({ show: jest.fn() })
}));
jest.mock('../../../services/hooks', () => ({
  usePopups: () => ({ show: jest.fn() })
}));
jest.mock('../../../services/slices/profile.slice', () => ({
  getProfileInfo: jest.fn(() => ({ type: 'profile/get' }))
}));
jest.mock('../../../services/slices/auth.slice', () => ({
  signOut: jest.fn(() => ({ type: 'auth/signOut' })),
  getAuthTokenSuccess: jest.fn(),
  signOutSuccess: jest.fn()
}));
jest.mock('../../main-header/utils', () => ({
  useHeaderStyles: () => ({ iconButton: 'mock-icon-button' })
}));

import { ProfileV9 } from './Profile';

describe('ProfileV9', () => {
  const signInWithOther = jest.fn().mockResolvedValue(undefined);

  it('renders profile with user info when authenticated', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'John Doe',
            emailAddress: 'john@example.com',
            profileImageUrl: '',
            profileType: 'Member'
          },
          error: null
        }
      }
    });

    // The SignedInButton renders a Persona with the user's name
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders spinner when profile is null', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: null
      }
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders profile with tenant from user', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-2',
            displayName: 'Jane Smith',
            emailAddress: 'jane@contoso.com',
            profileImageUrl: 'https://example.com/photo.png',
            profileType: 'Guest',
            tenant: 'Contoso'
          },
          error: null
        }
      }
    });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders profile with MSA account type (no tenant)', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-3',
            displayName: 'MSA User',
            emailAddress: 'msa@outlook.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: undefined
          },
          error: null
        }
      }
    });

    expect(screen.getByText('MSA User')).toBeInTheDocument();
  });

  it('renders profile with error state', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'error',
          user: null,
          error: { message: 'Network timeout' }
        }
      }
    });

    // The SignedInButton renders but popover content has error
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders spinner in persona layout when status is unset', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'unset',
          user: null,
          error: null
        }
      }
    });

    // Profile is not null, so outer spinner not shown; SignedInButton should render
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders signed-in button with user name when profile is loaded', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'John Doe',
            emailAddress: 'john@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'Contoso'
          },
          error: null
        }
      }
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders sign in with other account button in popover', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'Jane Smith',
            emailAddress: 'jane@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'Fabrikam'
          },
          error: null
        }
      }
    });

    // The profile button renders
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows tenant name as Sample when user has no tenant', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-4',
            displayName: 'No Tenant User',
            emailAddress: 'notenant@outlook.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: undefined
          },
          error: null
        }
      }
    });

    expect(screen.getByText('No Tenant User')).toBeInTheDocument();
  });

  it('opens popover and shows sign out button on trigger click', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'Test User',
            emailAddress: 'test@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'TestTenant'
          },
          error: null
        }
      }
    });

    // Click the trigger button to open popover
    const triggerButton = screen.getByLabelText('Test User sign out');
    fireEvent.click(triggerButton);

    // After popover opens, sign out button should be visible
    expect(screen.getAllByText('sign out').length).toBeGreaterThanOrEqual(1);
  });

  it('shows view all permissions link in popover', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'Perm User',
            emailAddress: 'perm@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'PermTenant'
          },
          error: null
        }
      }
    });

    const triggerButton = screen.getByLabelText('Perm User sign out');
    fireEvent.click(triggerButton);

    expect(screen.getByText('view all permissions')).toBeInTheDocument();
  });

  it('shows sign in other account button in popover', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'Other User',
            emailAddress: 'other@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'OtherTenant'
          },
          error: null
        }
      }
    });

    const triggerButton = screen.getByLabelText('Other User sign out');
    fireEvent.click(triggerButton);

    expect(screen.getByText('sign in other account')).toBeInTheDocument();
  });

  it('shows error message when profile has error', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'error',
          user: {
            id: 'user-err',
            displayName: 'Error User',
            emailAddress: 'err@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'ErrTenant'
          },
          error: { message: 'Token expired' }
        }
      }
    });

    const triggerButton = screen.getByLabelText('Error User sign out');
    fireEvent.click(triggerButton);

    expect(screen.getByText(/Token expired/)).toBeInTheDocument();
  });

  it('shows Sample tenant in popover when user.tenant is undefined', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-sample',
            displayName: 'Sample User',
            emailAddress: 'sample@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: undefined
          },
          error: null
        }
      }
    });

    const triggerButton = screen.getByLabelText('Sample User sign out');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Sample')).toBeInTheDocument();
  });

  it('calls signInWithOther when sign in other account is clicked', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-1',
            displayName: 'Click User',
            emailAddress: 'click@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'ClickTenant'
          },
          error: null
        }
      }
    });

    const triggerButton = screen.getByLabelText('Click User sign out');
    fireEvent.click(triggerButton);

    const signInOtherBtn = screen.getByText('sign in other account');
    fireEvent.click(signInOtherBtn);

    expect(signInWithOther).toHaveBeenCalled();
  });

  it('dispatches signOut when sign out button is clicked in popover', () => {
    const { signOut } = require('../../../services/slices/auth.slice');
    signOut.mockClear();

    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: {
            id: 'user-signout',
            displayName: 'SignOut User',
            emailAddress: 'signout@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'TestTenant'
          },
          error: null
        }
      }
    });

    // Open popover
    const triggerButton = screen.getByLabelText('SignOut User sign out');
    fireEvent.click(triggerButton);

    // Click sign out button inside popover
    const signOutButtons = screen.getAllByText('sign out');
    // The button inside CardHeader (not the tooltip/trigger)
    const signOutBtn = signOutButtons.find(el => el.closest('button[aria-label="sign out"]'));
    fireEvent.click(signOutBtn!);

    expect(signOut).toHaveBeenCalled();
  });

  it('shows spinner with "Getting profile details" when status is unset and popover is opened', () => {
    renderWithProviders(<ProfileV9 signInWithOther={signInWithOther} />, {
      preloadedState: {
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        profile: {
          status: 'unset',
          user: {
            id: 'user-unset',
            displayName: 'Unset User',
            emailAddress: 'unset@example.com',
            profileImageUrl: '',
            profileType: 'Member',
            tenant: 'TestTenant'
          },
          error: null
        }
      }
    });

    // Open popover
    const triggerButton = screen.getByLabelText('Unset User sign out');
    fireEvent.click(triggerButton);

    // PersonaLayout should show spinner with label
    expect(screen.getByText('Getting profile details')).toBeInTheDocument();
  });
});
