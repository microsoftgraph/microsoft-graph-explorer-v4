import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import { Sidebar } from './Sidebar';

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn()
  }
}));
jest.mock('../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn().mockReturnValue(''),
  getConsentAuthErrorHint: jest.fn().mockReturnValue(''),
  signInAuthError: jest.fn().mockReturnValue(false)
}));
jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn() },
  componentNames: {},
  eventTypes: {}
}));
jest.mock('./history/History', () => ({
  __esModule: true,
  default: () => <div data-testid="history">History</div>
}));
jest.mock('./resource-explorer', () => ({
  __esModule: true,
  default: () => <div data-testid="resource-explorer">Resources</div>
}));
jest.mock('./sample-queries/SampleQueries', () => ({
  SampleQueries: () => <div data-testid="sample-queries">Sample Queries</div>
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

describe('Sidebar', () => {
  const handleToggleSelect = jest.fn();

  beforeEach(() => {
    handleToggleSelect.mockClear();
  });

  it('renders sidebar with tabs', () => {
    renderWithProviders(<Sidebar handleToggleSelect={handleToggleSelect} />);
    expect(screen.getAllByText('Sample Queries').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Resources').length).toBeGreaterThan(0);
    expect(screen.getAllByText('History').length).toBeGreaterThan(0);
  });

  it('shows sample queries by default', () => {
    renderWithProviders(<Sidebar handleToggleSelect={handleToggleSelect} />);
    expect(screen.getByTestId('sample-queries')).toBeTruthy();
  });

  it('calls handleToggleSelect when toggling sidebar', () => {
    renderWithProviders(<Sidebar handleToggleSelect={handleToggleSelect} />);
    const toggleButton = screen.getByRole('button', { name: /sidebar/i });
    fireEvent.click(toggleButton);
    expect(handleToggleSelect).toHaveBeenCalledWith(false);
  });
});
