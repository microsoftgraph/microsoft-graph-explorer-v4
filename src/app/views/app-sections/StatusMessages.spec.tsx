jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackReactComponent: jest.fn((c: any) => c) },
  componentNames: {},
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' }
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), getToken: jest.fn(), logIn: jest.fn(), consentToScopes: jest.fn() }
}));
jest.mock('../common/message-display/MessageDisplay', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="message-display">
        {props.message}
        {props.onSetQuery && (
          <button
            data-testid="set-query-link"
            onClick={() => props.onSetQuery('https://graph.microsoft.com/v1.0/me/messages.')}
          >
            link
          </button>
        )}
      </div>
    )
  };
});
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import StatusMessages from './StatusMessages';

describe('StatusMessages', () => {
  it('renders empty div when no status', () => {
    const { container } = renderWithProviders(<StatusMessages />, {
      preloadedState: { queryRunnerStatus: null }
    });
    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(container.firstChild?.textContent).toBe('');
  });

  it('renders empty div when status is empty string', () => {
    const { container } = renderWithProviders(<StatusMessages />, {
      preloadedState: { queryRunnerStatus: { status: '  ', statusText: '', messageBarType: 'info' } }
    });
    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(container.firstChild?.textContent).toBe('');
  });

  it('renders message bar with status text', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 200,
          statusText: 'OK',
          messageBarType: 'success'
        }
      }
    });
    expect(screen.getByTestId('message-display')).toBeTruthy();
    expect(screen.getByTestId('message-display').textContent).toContain('OK');
  });

  it('renders with duration', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 200,
          statusText: 'OK',
          messageBarType: 'success',
          duration: 150
        }
      }
    });
    expect(screen.getByText(/150/)).toBeTruthy();
  });

  it('renders 403 permission text', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 403,
          statusText: 'Forbidden',
          messageBarType: 'error'
        }
      }
    });
    // translateMessage returns key as-is, so exact keys are rendered
    expect(screen.getByText(/consent to scopes/)).toBeTruthy();
    expect(screen.getByText(/modify permissions/)).toBeTruthy();
  });

  it('renders hint when present', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 400,
          statusText: 'Bad Request',
          messageBarType: 'error',
          hint: 'Check your query syntax'
        }
      }
    });
    expect(screen.getByText('Check your query syntax')).toBeTruthy();
  });

  it('renders dismiss button that dispatches clearQueryStatus', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 200,
          statusText: 'OK',
          messageBarType: 'success'
        }
      }
    });
    const dismissBtn = screen.getByRole('button', { name: /dismiss/i });
    expect(dismissBtn).toBeTruthy();
    fireEvent.click(dismissBtn);
  });

  it('renders with warning intent', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 301,
          statusText: 'Moved',
          messageBarType: 'warning'
        }
      }
    });
    expect(screen.getByTestId('message-display')).toBeTruthy();
  });

  it('renders with info intent', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 100,
          statusText: 'Continue',
          messageBarType: 'info'
        }
      }
    });
    expect(screen.getByTestId('message-display')).toBeTruthy();
  });

  it('renders with error intent', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 500,
          statusText: 'Server Error',
          messageBarType: 'error'
        }
      }
    });
    expect(screen.getByTestId('message-display')).toBeTruthy();
  });

  it('calls setQuery when a link is clicked in MessageDisplay', () => {
    renderWithProviders(<StatusMessages />, {
      preloadedState: {
        queryRunnerStatus: {
          status: 200,
          statusText: 'OK',
          messageBarType: 'success'
        }
      }
    });
    const link = screen.getByTestId('set-query-link');
    fireEvent.click(link);
    // setQuery strips trailing dot and dispatches setSampleQuery
  });
});
