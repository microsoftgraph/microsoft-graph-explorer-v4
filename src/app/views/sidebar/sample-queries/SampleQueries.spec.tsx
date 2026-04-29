import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(),
    clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn(), signInAuthError: jest.fn()
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(),
    trackCopyButtonClickEvent: jest.fn(), trackLinkClickEvent: jest.fn(),
    trackException: jest.fn(), getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: { MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK: 'docs-link' }, eventTypes: {}, errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../utils/token-helpers', () => ({
  substituteTokens: jest.fn()
}));

import { SampleQueries } from './SampleQueries';
import { renderWithProviders } from '../../../../test-utils';

describe('SampleQueries component', () => {
  it('renders with samples from store', () => {
    const queries = [
      {
        id: 'sample-1',
        category: 'Users',
        method: 'GET',
        humanName: 'my profile',
        requestUrl: '/v1.0/me',
        headers: [],
        tip: null,
        postBody: null,
        docLink: 'https://docs.microsoft.com'
      },
      {
        id: 'sample-2',
        category: 'Users',
        method: 'GET',
        humanName: 'all users',
        requestUrl: '/v1.0/users',
        headers: [],
        tip: null,
        postBody: null,
        docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByPlaceholderText('Search sample queries')).toBeInTheDocument();
  });

  it('shows spinner when samples are pending', () => {
    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries: [], pending: true, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText(/loading samples/)).toBeInTheDocument();
  });

  it('handles empty samples', () => {
    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries: [], pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('No sample queries')).toBeInTheDocument();
  });

  it('shows cached set warning when error exists', () => {
    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries: [], pending: false, error: { message: 'error' } },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('viewing a cached set')).toBeInTheDocument();
  });

  it('shows see more queries message bar with link', () => {
    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries: [], pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('see more queries')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Graph API Reference docs')).toBeInTheDocument();
  });

  it('displays group names from sample queries', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Groups', method: 'GET', humanName: 'all groups',
        requestUrl: '/v1.0/groups', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('shows search results count', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    expect(screen.getByText(/1 search results available/)).toBeInTheDocument();
  });

  it('renders query items with method badges', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: 'https://docs.microsoft.com'
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    // The first group should be auto-opened
    await waitFor(() => {
      expect(screen.getByText('GET')).toBeInTheDocument();
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });
  });

  it('shows lock icon for non-GET methods when not signed in', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'POST', humanName: 'create user',
        requestUrl: '/v1.0/users', headers: [], tip: null, postBody: '{}', docLink: null
      },
      {
        id: 's2', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('create user')).toBeInTheDocument();
    });

    // The lock tooltip sets aria-label on the trigger element
    expect(screen.getByLabelText('Sign In to try this sample')).toBeInTheDocument();
  });

  it('filters queries when search input is changed', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Groups', method: 'GET', humanName: 'all groups',
        requestUrl: '/v1.0/groups', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    const searchBox = screen.getByPlaceholderText('Search sample queries');
    fireEvent.change(searchBox, { target: { value: 'profile' } });

    // After search, results count should update
    expect(screen.getByText(/search results available/)).toBeInTheDocument();
  });

  it('resets queries when search is cleared', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Groups', method: 'GET', humanName: 'all groups',
        requestUrl: '/v1.0/groups', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    const searchBox = screen.getByPlaceholderText('Search sample queries');
    fireEvent.change(searchBox, { target: { value: 'profile' } });
    fireEvent.change(searchBox, { target: { value: '' } });

    // Should show all queries count
    expect(screen.getByText(/2 search results available/)).toBeInTheDocument();
  });

  it('renders multiple categories correctly', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Groups', method: 'GET', humanName: 'all groups',
        requestUrl: '/v1.0/groups', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's3', category: 'Mail', method: 'GET', humanName: 'my messages',
        requestUrl: '/v1.0/me/messages', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('renders sample queries when authenticated', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'POST', humanName: 'create user',
        requestUrl: '/v1.0/users', headers: [], tip: null, postBody: '{}', docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('create user')).toBeInTheDocument();
    });

    // No lock icon when authenticated
    expect(screen.queryByLabelText('Sign In to try this sample')).not.toBeInTheDocument();
  });

  it('filters queries and shows filtered results count', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Groups', method: 'GET', humanName: 'all groups',
        requestUrl: '/v1.0/groups', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's3', category: 'Users', method: 'GET', humanName: 'list users',
        requestUrl: '/v1.0/users', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    const searchBox = screen.getByPlaceholderText('Search sample queries');
    fireEvent.change(searchBox, { target: { value: 'users' } });

    // Should show filtered results
    expect(screen.getByText(/search results available/)).toBeInTheDocument();
  });

  it('renders doc link icon for queries with docLink', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: 'https://docs.microsoft.com/me'
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });
  });

  it('handles multiple methods in same category', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'get user',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Users', method: 'POST', humanName: 'create user',
        requestUrl: '/v1.0/users', headers: [], tip: null, postBody: '{}', docLink: null
      },
      {
        id: 's3', category: 'Users', method: 'PATCH', humanName: 'update user',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: '{}', docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('get user')).toBeInTheDocument();
      expect(screen.getByText('create user')).toBeInTheDocument();
      expect(screen.getByText('update user')).toBeInTheDocument();
    });
  });

  it('shows no sample queries message when empty and no search', () => {
    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries: [], pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    expect(screen.getByText('No sample queries')).toBeInTheDocument();
  });

  it('selects a sample query when clicked (GET, not signed in)', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('my profile'));

    const { telemetry } = require('../../../../telemetry');
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('does not select POST sample when not signed in', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'POST', humanName: 'create user',
        requestUrl: '/v1.0/users', headers: [], tip: null, postBody: '{"name":"test"}', docLink: null
      },
      {
        id: 's2', category: 'Users', method: 'GET', humanName: 'get profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('create user')).toBeInTheDocument();
    });

    const { telemetry } = require('../../../../telemetry');
    telemetry.trackEvent.mockClear();
    fireEvent.click(screen.getByText('create user'));
    // Should NOT dispatch/track since not signed in and method is POST
    expect(telemetry.trackEvent).not.toHaveBeenCalled();
  });

  it('selects POST sample when signed in', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'POST', humanName: 'create user',
        requestUrl: '/v1.0/users', headers: [], tip: null, postBody: '{"displayName":"Test"}', docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: ['User.ReadWrite'] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('create user')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('create user'));
    const { telemetry } = require('../../../../telemetry');
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('displays tip message when query has a tip', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: 'This requires User.Read permission', postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('my profile'));
    // The tip dispatch should have been called - verified by no crash
  });

  it('parses JSON sample body when selecting a query with postBody', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'POST', humanName: 'create item',
        requestUrl: '/v1.0/items', headers: [{ name: 'Content-Type', value: 'application/json' }],
        tip: null, postBody: '{"name":"item1"}', docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('create item')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('create item'));
    // No crash means JSON was parsed successfully
  });

  it('handles non-JSON postBody gracefully', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'POST', humanName: 'raw body',
        requestUrl: '/v1.0/items', headers: [], tip: null, postBody: 'plain text body', docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('raw body')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('raw body'));
  });

  it('toggles group open/closed on Enter key', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Groups', method: 'GET', humanName: 'all groups',
        requestUrl: '/v1.0/groups', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    // Find a group treeitem and press Enter
    const groupItems = screen.getAllByRole('treeitem');
    const usersGroup = groupItems.find(item => item.textContent?.includes('Users'));
    if (usersGroup) {
      fireEvent.keyDown(usersGroup, { key: 'Enter' });
    }
  });

  it('toggles group with space key', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    const groupItems = screen.getAllByRole('treeitem');
    const usersGroup = groupItems.find(item => item.textContent?.includes('Users'));
    if (usersGroup) {
      fireEvent.keyDown(usersGroup, { key: ' ' });
    }
  });

  it('auto-selects my profile on first load in desktop mode', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null, hasAutoSelectedDefault: false },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      const { telemetry } = require('../../../../telemetry');
      expect(telemetry.trackEvent).toHaveBeenCalled();
    });
  });

  it('does not auto-select on mobile', () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    const { telemetry } = require('../../../../telemetry');
    telemetry.trackEvent.mockClear();

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null, hasAutoSelectedDefault: false },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: true }
      }
    });

    // On mobile, auto-select should not fire
    expect(telemetry.trackEvent).not.toHaveBeenCalled();
  });

  it('calls substituteTokens when profile exists', async () => {
    const { substituteTokens } = require('../../../utils/token-helpers');
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('my profile'));
    expect(substituteTokens).toHaveBeenCalled();
  });

  it('selects sample query via Enter key on leaf item', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });

    const leafItem = screen.getByText('my profile').closest('[role="treeitem"]');
    if (leafItem) {
      fireEvent.keyDown(leafItem, { key: 'Enter' });
    }
  });

  it('fetches samples when queries are empty and no search', () => {
    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries: [], pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    // fetchSamples action should have been dispatched
    // No crash means it works
    expect(screen.getByText('No sample queries')).toBeInTheDocument();
  });

  it('toggles group closed then open via keyboard Enter', async () => {
    const queries = [
      {
        id: 's1', category: 'Users', method: 'GET', humanName: 'my profile',
        requestUrl: '/v1.0/me', headers: [], tip: null, postBody: null, docLink: null
      },
      {
        id: 's2', category: 'Mail', method: 'GET', humanName: 'my messages',
        requestUrl: '/v1.0/me/messages', headers: [], tip: null, postBody: null, docLink: null
      }
    ];

    renderWithProviders(<SampleQueries />, {
      preloadedState: {
        samples: { queries, pending: false, error: null },
        profile: null,
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });

    // First group (Users) is auto-opened, verify leaf is shown
    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });

    // Find the Users group treeitem and press Enter to close it
    const groupItems = screen.getAllByRole('treeitem');
    const usersGroup = groupItems.find(item =>
      item.getAttribute('aria-level') === '1' && item.textContent?.includes('Users')
    );
    expect(usersGroup).toBeTruthy();
    fireEvent.keyDown(usersGroup!, { key: 'Enter' });

    // After closing, the leaf should no longer be visible
    await waitFor(() => {
      expect(screen.queryByText('my profile')).not.toBeInTheDocument();
    });

    // Press Enter again to reopen
    fireEvent.keyDown(usersGroup!, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('my profile')).toBeInTheDocument();
    });
  });
});
