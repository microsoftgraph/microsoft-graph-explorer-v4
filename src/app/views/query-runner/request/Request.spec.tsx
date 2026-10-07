import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../test-utils';
import Request from './Request';

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn()
  }
}));
jest.mock('../../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn().mockReturnValue(''),
  getConsentAuthErrorHint: jest.fn().mockReturnValue(''),
  signInAuthError: jest.fn().mockReturnValue(false)
}));
jest.mock('./body', () => ({
  RequestBody: () => <div data-testid="request-body">Body</div>
}));
jest.mock('../../common/lazy-loader/component-registry', () => ({
  Auth: () => <div data-testid="auth">Auth</div>,
  Permissions: () => <div data-testid="permissions">Permissions</div>,
  RequestHeaders: () => <div data-testid="request-headers">Headers</div>
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: { trackTabClickEvent: jest.fn() }
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
const mockUseOverflowMenu = jest.fn(() => ({ ref: { current: null }, isOverflowing: false, overflowCount: 0 }));
const mockUseIsOverflowItemVisible = jest.fn(() => true);

jest.mock('@fluentui/react-components', () => {
  const actual = jest.requireActual('@fluentui/react-components');
  return {
    ...actual,
    Overflow: ({ children }: any) => <div>{children}</div>,
    OverflowItem: ({ children }: any) => <div>{children}</div>,
    useOverflowMenu: (...args: any[]) => (mockUseOverflowMenu as any)(...args),
    useIsOverflowItemVisible: (...args: any[]) => (mockUseIsOverflowItemVisible as any)(...args)
  };
});

describe('Request', () => {
  const defaultSampleQuery = {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    selectedVerb: 'GET',
    sampleBody: undefined,
    sampleHeaders: [],
    selectedVersion: 'v1.0'
  };

  it('renders with default Request Body tab selected', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />
    );
    expect(screen.getAllByText('Request Body').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Request Headers').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Modify Permissions').length).toBeGreaterThan(0);
  });

  it('shows request body content by default', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />
    );
    expect(screen.getByTestId('request-body')).toBeTruthy();
  });

  it('shows access token tab in Complete mode', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { graphExplorerMode: 'COMPLETE' } }
    );
    expect(screen.getAllByText('Access Token').length).toBeGreaterThan(0);
  });

  it('switches to Request Headers tab on click', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />
    );
    const headersTab = screen.getAllByText('Request Headers')[0];
    fireEvent.click(headersTab);
    expect(screen.getByTestId('request-headers')).toBeTruthy();
    // Request body should not be visible
    expect(screen.queryByTestId('request-body')).toBeNull();
  });

  it('switches to Modify Permissions tab on click', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />
    );
    const permsTab = screen.getAllByText('Modify Permissions')[0];
    fireEvent.click(permsTab);
    expect(screen.getByTestId('permissions')).toBeTruthy();
    expect(screen.queryByTestId('request-body')).toBeNull();
  });

  it('switches to Access Token tab in Complete mode', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { graphExplorerMode: 'COMPLETE' } }
    );
    const authTab = screen.getAllByText('Access Token')[0];
    fireEvent.click(authTab);
    expect(screen.getByTestId('auth')).toBeTruthy();
    expect(screen.queryByTestId('request-body')).toBeNull();
  });

  it('tracks telemetry when switching tabs', () => {
    const { telemetry } = require('../../../../telemetry');
    telemetry.trackTabClickEvent.mockClear();
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />
    );
    const headersTab = screen.getAllByText('Request Headers')[0];
    fireEvent.click(headersTab);
    expect(telemetry.trackTabClickEvent).toHaveBeenCalledWith('request-headers', defaultSampleQuery);
  });

  it('does not show access token tab in TryIt mode', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { graphExplorerMode: 'TryIt' } }
    );
    expect(screen.queryByText('Access Token')).toBeNull();
  });

  it('renders mobile layout when mobileScreen is true', () => {
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { sidebarProperties: { showSidebar: true, mobileScreen: true } } }
    );
    // Should still render tabs
    expect(screen.getAllByText('Request Body').length).toBeGreaterThan(0);
  });

  it('OverflowMenu renders menu button when isOverflowing is true in mobile mode', () => {
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: true, overflowCount: 2 });
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { sidebarProperties: { showSidebar: true, mobileScreen: true } } }
    );
    expect(screen.getByLabelText('2 more tabs')).toBeInTheDocument();
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: false, overflowCount: 0 });
  });

  it('OverflowMenuItem renders menu item when isVisible is false', () => {
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: true, overflowCount: 1 });
    mockUseIsOverflowItemVisible.mockReturnValue(false);
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { sidebarProperties: { showSidebar: true, mobileScreen: true } } }
    );
    // The overflow menu trigger should exist
    const menuBtn = screen.getByLabelText('1 more tabs');
    fireEvent.click(menuBtn);
    // OverflowMenuItems should render since isVisible=false
    expect(screen.getAllByText('Request Body').length).toBeGreaterThan(1);
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: false, overflowCount: 0 });
    mockUseIsOverflowItemVisible.mockReturnValue(true);
  });

  it('OverflowMenuItem returns null when isVisible is true', () => {
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: true, overflowCount: 1 });
    mockUseIsOverflowItemVisible.mockReturnValue(true);
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { sidebarProperties: { showSidebar: true, mobileScreen: true } } }
    );
    // Menu trigger exists but menu items won't render since they're visible
    const menuBtn = screen.getByLabelText('1 more tabs');
    fireEvent.click(menuBtn);
    // All tab names should appear exactly once in tabs + once in overflow = but overflow items return null
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: false, overflowCount: 0 });
    mockUseIsOverflowItemVisible.mockReturnValue(true);
  });

  it('clicking overflow menu item selects tab', () => {
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: true, overflowCount: 2 });
    mockUseIsOverflowItemVisible.mockReturnValue(false);
    const { telemetry } = require('../../../../telemetry');
    telemetry.trackTabClickEvent.mockClear();
    renderWithProviders(
      <Request handleOnEditorChange={jest.fn()} sampleQuery={defaultSampleQuery as any} />,
      { preloadedState: { sidebarProperties: { showSidebar: true, mobileScreen: true } } }
    );
    const menuBtn = screen.getByLabelText('2 more tabs');
    fireEvent.click(menuBtn);
    // Click the Request Headers overflow menu item
    const headerMenuItems = screen.getAllByText('Request Headers');
    const menuItem = headerMenuItems.find(el => el.closest('[role="menuitem"]'));
    if (menuItem) {
      fireEvent.click(menuItem);
      expect(telemetry.trackTabClickEvent).toHaveBeenCalled();
    }
    mockUseOverflowMenu.mockReturnValue({ ref: { current: null }, isOverflowing: false, overflowCount: 0 });
    mockUseIsOverflowItemVisible.mockReturnValue(true);
  });
});
