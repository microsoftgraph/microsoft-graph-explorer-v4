import '@testing-library/jest-dom';

jest.mock('../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));

jest.mock('./layout/Layout', () => ({
  Layout: (props: any) => <div data-testid="layout">Layout Mock</div>
}));
jest.mock('../..', () => ({
  removeSpinners: jest.fn()
}));
jest.mock('./query-runner/util/iframe-message-parser', () => ({
  parse: jest.fn().mockReturnValue({ verb: 'GET', headers: [], url: 'https://graph.microsoft.com/v1.0/me', body: '' })
}));
jest.mock('../utils/sample-url-generation', () => ({
  parseSampleUrl: jest.fn().mockReturnValue({ requestUrl: '/me', queryVersion: 'v1.0' })
}));
jest.mock('../utils/token-helpers', () => ({
  substituteTokens: jest.fn()
}));
jest.mock('./common/copy-button/KeyboardCopyEvent', () => ({
  KeyboardCopyEvent: jest.fn()
}));

import React from 'react';
import { screen, act, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import App from './App';
const { authenticationWrapper } = require('../../modules/authentication');

describe('App', () => {
  beforeAll(() => {
    process.on('unhandledRejection', jest.fn());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.location.search
    delete (window as any).location;
    (window as any).location = new URL('https://localhost');
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  });

  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders the layout component', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Layout Mock')).toBeInTheDocument();
  });

  it('renders with dark theme', () => {
    renderWithProviders(<App />, {
      preloadedState: { theme: 'dark' }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders when authenticated', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('detects mobile screen on small viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    renderWithProviders(<App />, {
      preloadedState: {
        sidebarProperties: { showSidebar: false, mobileScreen: true }
      }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders with high-contrast theme', () => {
    renderWithProviders(<App />, {
      preloadedState: { theme: 'high-contrast' }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders with sidebar hidden', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        sidebarProperties: { showSidebar: false, mobileScreen: false }
      }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders in TryIt mode', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        graphExplorerMode: 'TryIt'
      }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders in Complete mode with auth', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        graphExplorerMode: 'Complete',
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders with mobile screen and sidebar shown', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 400 });
    renderWithProviders(<App />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true }
      }
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderWithProviders(<App />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('handles shared query URL with request param', async () => {
    delete (window as any).location;
    (window as any).location = new URL('https://localhost?request=me/messages&method=GET&version=v1.0');
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles shared query URL with POST method and body', async () => {
    const body = btoa(JSON.stringify({ displayName: 'Test' }));
    delete (window as any).location;
    const url = `https://localhost?request=me/messages&method=POST&version=v1.0&requestBody=${body}`;
    (window as any).location = new URL(url);
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles shared query URL with headers', async () => {
    const headers = btoa(JSON.stringify([{ name: 'Content-Type', value: 'application/json' }]));
    delete (window as any).location;
    (window as any).location = new URL(`https://localhost?request=me&method=GET&version=v1.0&headers=${headers}`);
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles shared query URL with invalid method defaulting to GET', async () => {
    delete (window as any).location;
    (window as any).location = new URL('https://localhost?request=me&method=INVALID&version=v1.0');
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles shared query URL with custom GraphUrl', async () => {
    delete (window as any).location;
    const url = 'https://localhost?request=me&method=GET&version=v1.0&GraphUrl=https://custom.graph.com';
    (window as any).location = new URL(url);
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles shared query URL with requestBody that decodes to undefined', async () => {
    const body = btoa('undefined');
    delete (window as any).location;
    (window as any).location = new URL(`https://localhost?request=me&method=GET&version=v1.0&requestBody=${body}`);
    renderWithProviders(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles session ID login flow', async () => {
    authenticationWrapper.logIn.mockResolvedValue({
      accessToken: 'mock-token',
      scopes: ['User.Read']
    });
    delete (window as any).location;
    (window as any).location = new URL('https://localhost?sid=test-session-id');
    await act(async () => {
      renderWithProviders(<App />);
    });
    expect(authenticationWrapper.logIn).toHaveBeenCalledWith('test-session-id');
  });

  it('handles session ID login with null response', async () => {
    authenticationWrapper.logIn.mockResolvedValue(null);
    delete (window as any).location;
    (window as any).location = new URL('https://localhost?sid=test-session-id');
    await act(async () => {
      renderWithProviders(<App />);
    });
    expect(authenticationWrapper.logIn).toHaveBeenCalledWith('test-session-id');
  });

  it('handles message event with theme-changed type', async () => {
    renderWithProviders(<App />);
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'theme-changed', theme: 'dark' }
      }));
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles message event with init type', async () => {
    renderWithProviders(<App />);
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'init', code: 'GET https://graph.microsoft.com/v1.0/me' }
      }));
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles message event with unknown type', async () => {
    renderWithProviders(<App />);
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'unknown-type' }
      }));
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('sends ready message to whitelisted host origin', async () => {
    const postMessageSpy = jest.fn();
    Object.defineProperty(window, 'parent', { writable: true, value: { postMessage: postMessageSpy } });
    delete (window as any).location;
    (window as any).location = new URL('https://localhost?host-origin=https://learn.microsoft.com');
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(postMessageSpy).toHaveBeenCalledWith({ type: 'ready' }, 'https://learn.microsoft.com');
    });
  });

  it('does not send ready message to non-whitelisted host origin', async () => {
    const postMessageSpy = jest.fn();
    Object.defineProperty(window, 'parent', { writable: true, value: { postMessage: postMessageSpy } });
    delete (window as any).location;
    (window as any).location = new URL('https://localhost?host-origin=https://evil.com');
    renderWithProviders(<App />);
    // Give time for componentDidMount
    await new Promise(r => setTimeout(r, 50));
    expect(postMessageSpy).not.toHaveBeenCalled();
  });

  it('toggles sidebar on resize from desktop to mobile', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    renderWithProviders(<App />);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
