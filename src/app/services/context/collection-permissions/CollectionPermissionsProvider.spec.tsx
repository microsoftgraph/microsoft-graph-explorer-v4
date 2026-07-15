import '@testing-library/jest-dom';

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

import React, { useContext } from 'react';
import { screen, act, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import CollectionPermissionsProvider from './CollectionPermissionsProvider';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';

const TestConsumer = ({ paths }: { paths?: any[] }) => {
  const context = useContext(CollectionPermissionsContext);
  return (
    <div>
      <span data-testid="has-getPermissions">{typeof context.getPermissions === 'function' ? 'true' : 'false'}</span>
      <span data-testid="isFetching">{String(context.isFetching ?? false)}</span>
      <span data-testid="permissions">{context.permissions ? JSON.stringify(context.permissions) : 'undefined'}</span>
      <button data-testid="fetch-btn" onClick={() => context.getPermissions(paths || [])}>Fetch</button>
    </div>
  );
};

describe('CollectionPermissionsProvider', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children', () => {
    renderWithProviders(
      <CollectionPermissionsProvider>
        <div data-testid="child">Hello</div>
      </CollectionPermissionsProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides getPermissions function', () => {
    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer />
      </CollectionPermissionsProvider>
    );
    expect(screen.getByTestId('has-getPermissions').textContent).toBe('true');
  });

  it('provides default isFetching as false', () => {
    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer />
      </CollectionPermissionsProvider>
    );
    expect(screen.getByTestId('isFetching').textContent).toBe('false');
  });

  it('provides default permissions as undefined', () => {
    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer />
      </CollectionPermissionsProvider>
    );
    expect(screen.getByTestId('permissions').textContent).toBe('undefined');
  });

  it('fetches permissions successfully and updates context', async () => {
    const mockResults = { results: [{ value: 'User.Read', consentDisplayName: 'Read user profile' }] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResults)
    });

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('false');
    });

    expect(screen.getByTestId('permissions').textContent).not.toBe('undefined');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('handles fetch error and sets permissions to undefined', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('false');
    });

    expect(screen.getByTestId('permissions').textContent).toBe('undefined');
  });

  it('caches results and does not re-fetch for same paths', async () => {
    const mockResults = { results: [{ value: 'User.Read' }] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResults)
    });

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    // First fetch
    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('false');
    });

    // Second fetch with same paths - should use cache
    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    // fetch should only be called once (for first request)
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches with correct URL and body', async () => {
    const mockResults = { results: [] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResults)
    });

    const paths = [
      { method: 'POST', url: '/users', version: 'beta', scope: 'Application' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('?version=beta&scopeType=Application'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String)
        })
      );
    });
  });

  it('skips versions/scopes with no matching paths', async () => {
    const mockResults = { results: [] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResults)
    });

    // Empty paths array - no requests should be made
    const paths: any[] = [];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    // Should not fetch because there are no paths
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles response without results property', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({})
    });

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('false');
    });

    // Should set empty array when results is undefined
    const permsText = screen.getByTestId('permissions').textContent!;
    expect(JSON.parse(permsText)['v1.0-DelegatedWork']).toEqual([]);
  });

  it('handles multiple versions and scopes', async () => {
    const mockResults = { results: [{ value: 'User.Read' }] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResults)
    });

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' },
      { method: 'POST', url: '/users', version: 'beta', scope: 'Application' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('false');
    });

    // Should make separate fetch calls for each version-scope combination
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const permsText = screen.getByTestId('permissions').textContent!;
    const perms = JSON.parse(permsText);
    expect(perms['v1.0-DelegatedWork']).toEqual([{ value: 'User.Read' }]);
    expect(perms['beta-Application']).toEqual([{ value: 'User.Read' }]);
  });

  it('sets isFetching to true while fetching', async () => {
    let resolvePromise: Function;
    const fetchPromise = new Promise((resolve) => { resolvePromise = resolve; });
    global.fetch = jest.fn().mockReturnValue(fetchPromise);

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>
    );

    act(() => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('true');
    });

    // Resolve the promise
    await act(async () => {
      resolvePromise!({ json: () => Promise.resolve({ results: [] }) });
    });

    await waitFor(() => {
      expect(screen.getByTestId('isFetching').textContent).toBe('false');
    });
  });

  it('uses baseUrl from devxApi state', async () => {
    const mockResults = { results: [] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResults)
    });

    const paths = [
      { method: 'GET', url: '/me', version: 'v1.0', scope: 'DelegatedWork' }
    ];

    renderWithProviders(
      <CollectionPermissionsProvider>
        <TestConsumer paths={paths} />
      </CollectionPermissionsProvider>,
      {
        preloadedState: {
          devxApi: { baseUrl: 'https://custom-api.example.com', parameters: '' }
        }
      }
    );

    await act(async () => {
      screen.getByTestId('fetch-btn').click();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom-api.example.com/permissions'),
        expect.anything()
      );
    });
  });
});
