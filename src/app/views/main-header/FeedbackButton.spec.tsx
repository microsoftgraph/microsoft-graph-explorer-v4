jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: {},
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../telemetry/component-names', () => ({
  FEEDBACK_BUTTON: 'feedback'
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));
jest.mock('../query-runner/request/feedback/FeedbackForm', () => ({
  __esModule: true,
  default: () => <div data-testid="feedback-form">FeedbackForm</div>
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import { FeedbackButton } from './FeedbackButton';

describe('FeedbackButton', () => {
  it('renders null for AAD profile', () => {
    const { container } = renderWithProviders(<FeedbackButton />, {
      preloadedState: {
        profile: { user: { profileType: 'AAD' } }
      }
    });
    expect(container.firstChild).toBeNull();
  });

  it('renders feedback button for MSA profile', () => {
    const { container } = renderWithProviders(<FeedbackButton />, {
      preloadedState: {
        profile: { user: { profileType: 'MSA' } }
      }
    });
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('tracks telemetry when feedback button is clicked', () => {
    const { telemetry } = require('../../../telemetry');
    telemetry.trackEvent.mockClear();
    const { container } = renderWithProviders(<FeedbackButton />, {
      preloadedState: {
        profile: { user: { profileType: 'MSA' } }
      }
    });
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    fireEvent.click(button!);
    expect(telemetry.trackEvent).toHaveBeenCalledWith('btn', expect.objectContaining({
      ComponentName: 'feedback'
    }));
  });

  it('renders feedback button when user is undefined', () => {
    const { container } = renderWithProviders(<FeedbackButton />, {
      preloadedState: {
        profile: { user: undefined }
      }
    });
    // user?.profileType !== 'AAD' is true when user is undefined, so it renders
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
