jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: { HELP_BUTTON: 'help' },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../telemetry/component-names', () => ({
  GE_DOCUMENTATION_LINK: 'ge-docs',
  GITHUB_LINK: 'github',
  GRAPH_DOCUMENTATION_LINK: 'graph-docs',
  REPORT_AN_ISSUE_LINK: 'report-issue',
  FEEDBACK_BUTTON: 'feedback'
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import { Help } from './Help';

describe('Help', () => {
  it('renders help button', () => {
    renderWithProviders(<Help />);
    expect(screen.getByRole('button', { name: /Help/i })).toBeTruthy();
  });

  it('clicking help button tracks telemetry', () => {
    const { telemetry } = require('../../../telemetry');
    telemetry.trackEvent.mockClear();
    renderWithProviders(<Help />);
    fireEvent.click(screen.getByRole('button', { name: /Help/i }));
    expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', expect.objectContaining({
      ComponentName: 'help'
    }));
  });

  it('renders menu items when menu is opened', async () => {
    renderWithProviders(<Help />);
    fireEvent.click(screen.getByRole('button', { name: /Help/i }));
    const { waitFor } = require('@testing-library/react');
    await waitFor(() => {
      expect(screen.getByText('Report an Issue')).toBeTruthy();
    });
    expect(screen.getByText('Get started with Graph Explorer')).toBeTruthy();
  });

  it('clicking a menu link tracks link click telemetry', async () => {
    const { telemetry } = require('../../../telemetry');
    telemetry.trackLinkClickEvent.mockClear();
    renderWithProviders(<Help />);
    fireEvent.click(screen.getByRole('button', { name: /Help/i }));
    const { waitFor } = require('@testing-library/react');
    await waitFor(() => {
      expect(screen.getByText('Report an Issue')).toBeTruthy();
    });
    const reportLink = screen.getByText('Report an Issue');
    fireEvent.click(reportLink);
    expect(telemetry.trackLinkClickEvent).toHaveBeenCalled();
  });
});
