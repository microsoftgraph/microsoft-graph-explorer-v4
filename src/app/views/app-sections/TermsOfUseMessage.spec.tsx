jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: { MICROSOFT_APIS_TERMS_OF_USE_LINK: 'terms', MICROSOFT_PRIVACY_STATEMENT_LINK: 'privacy' },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import TermsOfUseMessage from './TermsOfUseMessage';

describe('TermsOfUseMessage', () => {
  it('renders terms message when termsOfUse is true', () => {
    renderWithProviders(<TermsOfUseMessage />, {
      preloadedState: { termsOfUse: true }
    });
    expect(screen.getByRole('link', { name: /Terms of use/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Microsoft Privacy Statement/i })).toBeTruthy();
  });

  it('renders empty div when termsOfUse is false', () => {
    const { container } = renderWithProviders(<TermsOfUseMessage />, {
      preloadedState: { termsOfUse: false }
    });
    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(container.firstChild?.textContent).toBe('');
  });
});
