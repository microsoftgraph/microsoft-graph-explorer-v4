jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));
jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: {}, eventTypes: {}
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../test-utils';
import { Tenant } from './Tenant';

describe('Tenant', () => {
  it('renders Tenant button with "Sample" when no user tenant', () => {
    renderWithProviders(<Tenant />, {
      preloadedState: {
        profile: { user: null }
      }
    });
    expect(screen.getByText('Tenant')).toBeInTheDocument();
  });

  it('renders user tenant when profile has tenant', () => {
    renderWithProviders(<Tenant />, {
      preloadedState: {
        profile: { user: { tenant: 'Contoso' } }
      }
    });
    expect(screen.getAllByText('Contoso').length).toBeGreaterThan(0);
  });

  it('renders "Sample" as secondary content when tenant is undefined', () => {
    renderWithProviders(<Tenant />, {
      preloadedState: {
        profile: { user: { displayName: 'Test', tenant: undefined } }
      }
    });
    expect(screen.getByText('Sample')).toBeInTheDocument();
  });
});
