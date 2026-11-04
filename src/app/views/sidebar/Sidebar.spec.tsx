import React from 'react';
import { act, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import { createMockStore, renderWithProviders } from '../../../test-utils';
import { Sidebar } from './Sidebar';
import sidebarReducer, { toggleSidebar } from '../../services/slices/sidebar-properties.slice';

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
    renderWithProviders(<Sidebar expanded handleToggleSelect={handleToggleSelect} />);
    expect(screen.getAllByText('Sample Queries').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Resources').length).toBeGreaterThan(0);
    expect(screen.getAllByText('History').length).toBeGreaterThan(0);
  });

  it('shows sample queries by default', () => {
    renderWithProviders(<Sidebar expanded handleToggleSelect={handleToggleSelect} />);
    expect(screen.getByTestId('sample-queries')).toBeTruthy();
  });

  it('calls handleToggleSelect when toggling sidebar', () => {
    renderWithProviders(<Sidebar expanded handleToggleSelect={handleToggleSelect} />);
    const toggleButton = screen.getByRole('button', { name: /sidebar/i });
    fireEvent.click(toggleButton);
    expect(handleToggleSelect).toHaveBeenCalledWith(false);
  });

  it('expands a collapsed desktop sidebar when selecting a tab', () => {
    renderWithProviders(<Sidebar expanded={false} handleToggleSelect={handleToggleSelect} />);
    // Collapsed tabs show only their icons.
    fireEvent.click(screen.getAllByRole('tab')[2]);
    expect(handleToggleSelect).toHaveBeenCalledWith(true);
  });

  it('renders a labelled full-screen drawer with an explicit close action', () => {
    renderWithProviders(
      <Sidebar expanded={false} handleToggleSelect={handleToggleSelect} />,
      { preloadedState: { sidebarProperties: { showSidebar: true, mobileScreen: true } } }
    );
    const drawer = screen.getByRole('dialog', { name: 'Queries' });
    expect(drawer).toBeVisible();
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('tab', { name: 'Sample Queries' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleToggleSelect).toHaveBeenCalledWith(false);
  });

  it('makes the page behind the open mobile drawer inert until it closes', () => {
    const appRoot = document.createElement('div');
    appRoot.id = 'root';
    document.body.appendChild(appRoot);
    const initialState = {
      ...createMockStore().getState(),
      sidebarProperties: { showSidebar: true, mobileScreen: true }
    };
    const store = configureStore({
      reducer: (state = initialState, action) => ({
        ...state, sidebarProperties: sidebarReducer(state.sidebarProperties, action)
      })
    });
    renderWithProviders(<Sidebar expanded handleToggleSelect={handleToggleSelect} />, { store });
    expect(appRoot).toHaveAttribute('inert');
    act(() => { store.dispatch(toggleSidebar({ showSidebar: false })); });
    expect(appRoot).not.toHaveAttribute('inert');
    appRoot.remove();
  });

  it('keeps the selected mobile tab across closing and reopening', async () => {
    const initialState = {
      ...createMockStore().getState(),
      sidebarProperties: { showSidebar: true, mobileScreen: true }
    };
    const store = configureStore({
      reducer: (state = initialState, action) => ({
        ...state, sidebarProperties: sidebarReducer(state.sidebarProperties, action)
      })
    });
    renderWithProviders(
      <Sidebar expanded handleToggleSelect={handleToggleSelect} />,
      { store }
    );
    fireEvent.click(screen.getByRole('tab', { name: 'History' }));
    act(() => { store.dispatch(toggleSidebar({ showSidebar: false })); });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    act(() => { store.dispatch(toggleSidebar({ showSidebar: true })); });
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('history')).toBeVisible();
  });
});
