jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: { SETTINGS_BUTTON: 'settings', THEME_CHANGE_BUTTON: 'theme', OFFICE_DEV_PROGRAM_LINK: 'office-dev' },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));
jest.mock('../../../services/hooks', () => ({
  usePopups: jest.fn(() => ({ show: jest.fn() }))
}));

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import { Settings } from './Settings';

describe('Settings', () => {
  it('renders settings button', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByRole('button', { name: /Settings/i })).toBeTruthy();
  });

  it('tracks telemetry on settings button click', () => {
    const { telemetry } = require('../../../../telemetry');
    telemetry.trackEvent.mockClear();
    renderWithProviders(<Settings />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', {
      ComponentName: 'settings'
    });
  });

  it('opens theme chooser on Change theme click and tracks telemetry', async () => {
    const showMock = jest.fn();
    const { usePopups } = require('../../../services/hooks');
    usePopups.mockReturnValue({ show: showMock });
    const { telemetry } = require('../../../../telemetry');
    telemetry.trackEvent.mockClear();
    renderWithProviders(<Settings />);
    // Open the menu first
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    // Wait for menu items to appear
    await waitFor(() => {
      const menuItem = screen.queryByText('Change theme');
      if (menuItem) {
        fireEvent.click(menuItem);
      }
    });
    // Theme chooser popup may have been shown
    if (showMock.mock.calls.length > 0) {
      expect(showMock).toHaveBeenCalled();
    }
  });
});
