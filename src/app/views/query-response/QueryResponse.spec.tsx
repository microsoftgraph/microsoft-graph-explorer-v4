jest.mock('../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(),
    trackReactComponent: jest.fn((c: any) => c), trackTabClickEvent: jest.fn()
  },
  eventTypes: {}, componentNames: {}
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    getAccount: jest.fn(), getToken: jest.fn().mockResolvedValue({ accessToken: 'mock-token' }),
    logIn: jest.fn(), consentToScopes: jest.fn()
  }
}));

jest.mock('./pivot-items/pivot-item', () => ({
  GetPivotItems: () => <div data-testid="pivot-items">PivotItems</div>
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import QueryResponse from './QueryResponse';

describe('QueryResponse', () => {
  it('renders the response container', () => {
    renderWithProviders(<QueryResponse />);
    expect(screen.getAllByTestId('pivot-items').length).toBeGreaterThanOrEqual(1);
  });

  it('renders expand button', () => {
    renderWithProviders(<QueryResponse />);
    expect(screen.getByRole('button', { name: 'Expand' })).toBeVisible();
  });

  it('opens response tabs in a dialog and closes it', () => {
    renderWithProviders(<QueryResponse />);
    const expand = screen.getByRole('button', { name: 'Expand' });
    fireEvent.click(expand);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByTestId('pivot-items')).toBeVisible();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(expand).toBeVisible();
  });
});
