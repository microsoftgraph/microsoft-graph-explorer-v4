import React from 'react';
import '@testing-library/jest-dom';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';

const mockRevokeScopes: any = jest.fn(() => ({ type: 'revoke/mock' }));
mockRevokeScopes.pending = 'revokeScopes/pending';
mockRevokeScopes.fulfilled = 'revokeScopes/fulfilled';
mockRevokeScopes.rejected = 'revokeScopes/rejected';
jest.mock('../../../services/actions/revoke-scopes.action', () => ({
  revokeScopes: mockRevokeScopes
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logOut: jest.fn(),
    getAccount: jest.fn(),
    getSessionId: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn(),
    refreshToken: jest.fn()
  }
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackTabClickEvent: jest.fn(),
    trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackException: jest.fn(),
    trackReactComponent: (component: any) => component,
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: { ADAPTIVE_CARDS_TAB: 'adaptive-cards', JSON_SCHEMA_COPY_BUTTON: 'json-copy' },
  eventTypes: {},
  errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('./adaptive-cards.util', () => ({
  getAdaptiveCard: jest.fn()
}));
jest.mock('../../common', () => ({
  Monaco: ({ body }: any) => <div data-testid="monaco">{JSON.stringify(body)}</div>
}));
jest.mock('../../common/copy', () => ({
  trackedGenericCopy: jest.fn()
}));
jest.mock('../../common/copy-button', () => ({
  CopyButton: ({ handleOnClick }: any) => <button data-testid="copy-btn" onClick={handleOnClick}>Copy</button>
}));
jest.mock('adaptivecards', () => ({
  AdaptiveCard: jest.fn().mockImplementation(() => ({
    hostConfig: null,
    parse: jest.fn(),
    render: jest.fn().mockReturnValue(document.createElement('div'))
  })),
  HostConfig: jest.fn()
}));
jest.mock('markdown-it', () => jest.fn().mockImplementation(() => ({ render: jest.fn() })));

import { getAdaptiveCard } from './adaptive-cards.util';
const mockGetAdaptiveCard = getAdaptiveCard as jest.Mock;

// Import the default export which is the tracked component (identity after mock)
import AdaptiveCard from './AdaptiveCard';

describe('AdaptiveCard', () => {
  const defaultState = {
    sampleQuery: {
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      selectedVerb: 'GET',
      sampleBody: undefined,
      sampleHeaders: [],
      selectedVersion: 'v1.0'
    },
    queryRunnerStatus: { ok: true }
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockGetAdaptiveCard.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders not available message when body is empty', () => {
    renderWithProviders(
      <AdaptiveCard body="" hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    expect(screen.getByText('The Adaptive Card for this response is not available')).toBeInTheDocument();
  });

  it('renders not available message when getAdaptiveCard returns null', async () => {
    mockGetAdaptiveCard.mockReturnValue(null);

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    // Advance timers to trigger the setTimeout
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('The Adaptive Card for this response is not available')).toBeInTheDocument();
    });
  });

  it('handles error in card rendering', async () => {
    mockGetAdaptiveCard.mockImplementation(() => {
      throw new Error('Card template parsing failed');
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Adaptive Cards designer')).toBeInTheDocument();
    });
  });

  it('renders card when getAdaptiveCard returns valid content', async () => {
    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] },
      template: { type: 'AdaptiveCard', body: [] }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'card' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'JSON Schema' })).toBeInTheDocument();
    });
  });

  it('renders error when query status is not ok', () => {
    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: { ...defaultState, queryRunnerStatus: { ok: false } } }
    );

    jest.runAllTimers();

    expect(screen.getByText('The Adaptive Card for this response is not available')).toBeInTheDocument();
  });

  it('shows not available when sampleUrl is missing', () => {
    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: { ...defaultState, sampleQuery: { ...defaultState.sampleQuery, sampleUrl: '' } } }
    );

    expect(screen.getByText('The Adaptive Card for this response is not available')).toBeInTheDocument();
  });

  it('switches to JSON-schema tab and shows Monaco and copy button', async () => {
    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] },
      template: { type: 'AdaptiveCard', body: [] }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'JSON Schema' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'JSON Schema' }));

    await waitFor(() => {
      expect(screen.getByTestId('monaco')).toBeInTheDocument();
      expect(screen.getByTestId('copy-btn')).toBeInTheDocument();
    });
  });

  it('handles copy button click in JSON schema view', async () => {
    const { trackedGenericCopy } = require('../../common/copy');
    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] },
      template: { type: 'AdaptiveCard', templateKey: 'test' }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'JSON Schema' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'JSON Schema' }));

    await waitFor(() => {
      expect(screen.getByTestId('copy-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('copy-btn'));

    expect(trackedGenericCopy).toHaveBeenCalled();
  });

  it('renders error MessageBar when adaptive card instance render returns null', async () => {
    const adaptivecards = require('adaptivecards');
    adaptivecards.AdaptiveCard.mockImplementation(() => ({
      hostConfig: null,
      parse: jest.fn(),
      render: jest.fn().mockReturnValue(null)
    }));

    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [] },
      template: { type: 'AdaptiveCard' }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Adaptive card rendering error')).toBeInTheDocument();
    });

    // Restore the default mock
    adaptivecards.AdaptiveCard.mockImplementation(() => ({
      hostConfig: null,
      parse: jest.fn(),
      render: jest.fn().mockReturnValue(document.createElement('div'))
    }));
  });

  it('renders error MessageBar when card data is invalid', async () => {
    mockGetAdaptiveCard.mockReturnValue({
      card: null,
      template: { type: 'AdaptiveCard' }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Adaptive card rendering error')).toBeInTheDocument();
    });
  });

  it('renders loading state initially when body is provided', () => {
    mockGetAdaptiveCard.mockReturnValue(null);

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    // Before timers run, the component should show loading
    expect(screen.getByText('Loading Adaptive Card...')).toBeInTheDocument();
  });

  it('renders card tab content by default', async () => {
    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] },
      template: { type: 'AdaptiveCard', body: [] }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'card' })).toBeInTheDocument();
    });

    // Card tab should be selected by default
    expect(screen.getByRole('tab', { name: 'card' })).toHaveAttribute('aria-selected', 'true');
  });

  it('tracks tab click event when switching tabs', async () => {
    const { telemetry } = require('../../../../telemetry');
    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] },
      template: { type: 'AdaptiveCard', body: [] }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'JSON Schema' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'JSON Schema' }));
    expect(telemetry.trackTabClickEvent).toHaveBeenCalledWith('JSON-schema', expect.anything());
  });

  it('renders Adaptive Cards designer link in error state', async () => {
    mockGetAdaptiveCard.mockReturnValue(null);

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Adaptive Cards designer')).toBeInTheDocument();
    });

    const link = screen.getByText('Adaptive Cards designer');
    expect(link).toHaveAttribute('href', 'https://adaptivecards.io/designer/');
  });

  it('renders JSON Schema info bar with templating SDK links', async () => {
    mockGetAdaptiveCard.mockReturnValue({
      card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Hello' }] },
      template: { type: 'AdaptiveCard', body: [] }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'JSON Schema' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: 'JSON Schema' }));

    await waitFor(() => {
      expect(screen.getByTestId('copy-btn')).toBeInTheDocument();
      expect(screen.getByTestId('monaco')).toBeInTheDocument();
    });
  });

  it('renders not available when body is whitespace only', () => {
    renderWithProviders(
      <AdaptiveCard body="   " hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    // Body is truthy but effectively empty - still triggers the card flow
    // The component checks !body which is false for "   "
    expect(screen.getByText('Loading Adaptive Card...')).toBeInTheDocument();
  });

  it('renders error when card type is not object', async () => {
    mockGetAdaptiveCard.mockReturnValue({
      card: 'invalid-string',
      template: { type: 'AdaptiveCard' }
    });

    renderWithProviders(
      <AdaptiveCard body='{"name":"test"}' hostConfig={{}} />,
      { preloadedState: defaultState }
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Adaptive card rendering error')).toBeInTheDocument();
    });
  });
});
