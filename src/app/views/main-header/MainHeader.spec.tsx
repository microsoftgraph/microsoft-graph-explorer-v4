jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: {},
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));
jest.mock('../authentication/Authentication', () => ({
  __esModule: true,
  default: () => <div data-testid="authentication">Auth</div>
}));
jest.mock('./FeedbackButton', () => ({
  FeedbackButton: () => <div data-testid="feedback">Feedback</div>
}));
jest.mock('./Help', () => ({
  Help: () => <div data-testid="help">Help</div>
}));
jest.mock('./settings/Settings', () => ({
  Settings: () => <div data-testid="settings">Settings</div>
}));
jest.mock('./Tenant', () => ({
  Tenant: () => <div data-testid="tenant">Tenant</div>
}));

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import { MainHeader } from './MainHeader';

describe('MainHeader', () => {
  it('renders Graph Explorer text', () => {
    renderWithProviders(<MainHeader />);
    expect(screen.getByText('Graph Explorer')).toBeTruthy();
  });

  it('renders child components', () => {
    renderWithProviders(<MainHeader />);
    expect(screen.getByTestId('authentication')).toBeTruthy();
    expect(screen.getByTestId('feedback')).toBeTruthy();
    expect(screen.getByTestId('help')).toBeTruthy();
    expect(screen.getByTestId('settings')).toBeTruthy();
    expect(screen.getByTestId('tenant')).toBeTruthy();
  });

  it('renders in mobile mode', () => {
    renderWithProviders(<MainHeader />, {
      preloadedState: {
        sidebarProperties: { showSidebar: false, mobileScreen: true }
      }
    });
    expect(screen.getByText('Graph Explorer')).toBeTruthy();
  });
});
