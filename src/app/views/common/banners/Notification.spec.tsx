jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackReactComponent: jest.fn((c: any) => c)
  },
  componentNames: {
    GRAPH_EXPLORER_TUTORIAL_LINK: 'tutorial',
    NOTIFICATION_BANNER_DISMISS_BUTTON: 'dismiss',
    NOTIFICATION_COMPONENT: 'notification'
  },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));
jest.mock('./Notification.styles', () => ({
  useNotificationStyles: () => ({ container: '', body: '' })
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import Notification from './Notification';

const defaultProps = {
  header: 'Test Header',
  content: 'Test Content',
  link: 'https://example.com',
  linkText: 'Learn More'
};

describe('Notification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders when visible', () => {
    renderWithProviders(<Notification {...defaultProps} />);
    expect(screen.getByText('Test Header')).toBeTruthy();
    expect(screen.getByText(/Test Content/)).toBeTruthy();
    expect(screen.getByText(/Learn More/)).toBeTruthy();
  });

  it('does not render when dismissed via localStorage', () => {
    localStorage.setItem('bannerIsVisible', 'false');
    const { container } = renderWithProviders(<Notification {...defaultProps} />);
    expect(screen.queryByText('Test Header')).toBeNull();
  });

  it('handles dismiss click', () => {
    renderWithProviders(<Notification {...defaultProps} />);
    expect(screen.getByText('Test Header')).toBeTruthy();

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    expect(screen.queryByText('Test Header')).toBeNull();
    expect(localStorage.getItem('bannerIsVisible')).toBe('false');
  });
});
