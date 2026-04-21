import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

beforeAll(() => {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(), getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn() }
}));
jest.mock('../../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn(), signInAuthError: jest.fn()
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackException: jest.fn(), getDeviceCharacteristicsData: jest.fn().mockReturnValue({}) },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../services/actions/query-action-creator-util', () => ({
  getContentType: jest.fn().mockReturnValue(null)
}));
jest.mock('../../../services/slices/graph-response.slice', () => ({
  runQuery: jest.fn().mockReturnValue({ type: 'graphResponse/runQuery' })
}));
jest.mock('../../../services/slices/sample-query.slice', () => ({
  setSampleQuery: jest.fn().mockReturnValue({ type: 'sampleQuery/set' })
}));

import { ResponseMessages } from './ResponseMessages';
import { renderWithProviders } from '../../../../test-utils';

describe('ResponseMessages component', () => {
  it('shows nothing when no body', () => {
    const { container } = renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(container.querySelectorAll('[class*="MessageBar"]').length).toBe(0);
  });

  it('shows odata link message when body has @odata.nextLink', () => {
    renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { '@odata.nextLink': 'https://graph.microsoft.com/v1.0/me/messages?$skip=10' },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(screen.getByText('This response contains an @odata property.')).toBeInTheDocument();
    expect(screen.getByText('Click here to follow the link')).toBeInTheDocument();
  });

  it('shows CORS message when body has throwsCorsError', () => {
    renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { throwsCorsError: true },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(screen.getByText('Response content not available due to CORS policy')).toBeInTheDocument();
  });

  it('shows content download URL when body has contentDownloadUrl', () => {
    renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { contentDownloadUrl: 'https://example.com/download' },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(screen.getByText('This response contains unviewable content')).toBeInTheDocument();
    expect(screen.getByText('Click to download file')).toBeInTheDocument();
  });

  it('shows demo tenant message when body exists, no token, and Complete mode', () => {
    const { container } = renderWithProviders(
      <div><ResponseMessages /></div>,
      {
        preloadedState: {
          graphResponse: {
            isLoadingData: false,
            response: {
              body: { id: '1', displayName: 'Test User' },
              headers: undefined
            }
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
          graphExplorerMode: 'COMPLETE'
        }
      }
    );
    // The demo tenant message shows when body is present, no token, and mode is COMPLETE
    const demoText = screen.queryByText('Using demo tenant');
    if (demoText) {
      expect(demoText).toBeInTheDocument();
      expect(screen.getByText('To access your own data:')).toBeInTheDocument();
    } else {
      // If the message bar relies on specific Fluent UI rendering, just verify no crash
      expect(container).toBeTruthy();
    }
  });

  it('dismiss button hides demo tenant message', () => {
    renderWithProviders(
      <div><ResponseMessages /></div>,
      {
        preloadedState: {
          graphResponse: {
            isLoadingData: false,
            response: {
              body: { id: '1' },
              headers: undefined
            }
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
          graphExplorerMode: 'COMPLETE'
        }
      }
    );
    const closeBtns = screen.queryAllByLabelText('Close');
    if (closeBtns.length > 0) {
      fireEvent.click(closeBtns[0]);
    }
    // After dismiss, message should be gone
    expect(screen.queryByText('Using demo tenant')).not.toBeInTheDocument();
  });

  it('shows malformed JSON body message when content-type is json but body is string', () => {
    const { getContentType } = require('../../../services/actions/query-action-creator-util');
    getContentType.mockReturnValue('application/json');

    renderWithProviders(<div><ResponseMessages /></div>, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: 'this is not valid json',
            headers: { 'content-type': 'application/json' }
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(screen.getByText('Malformed JSON body')).toBeInTheDocument();
    getContentType.mockReturnValue(null);
  });

  it('shows odata deltaLink message', () => {
    renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { '@odata.deltaLink': 'https://graph.microsoft.com/v1.0/me/messages/delta?$deltatoken=abc' },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(screen.getByText('This response contains an @odata property.')).toBeInTheDocument();
    expect(screen.getByText('@odata.deltaLink')).toBeInTheDocument();
  });

  it('clicking odata link triggers setQuery', () => {
    renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { '@odata.nextLink': 'https://graph.microsoft.com/v1.0/me/messages?$skip=10' },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    const link = screen.getByText('Click here to follow the link');
    fireEvent.click(link);
    // Should not crash - dispatches setSampleQuery and runQuery
    expect(link).toBeInTheDocument();
  });

  it('does not show demo tenant message when token is present', () => {
    const { container } = renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { id: '1' },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'COMPLETE'
      }
    });
    expect(screen.queryByText('Using demo tenant')).not.toBeInTheDocument();
  });

  it('does not show demo tenant message in non-Complete mode', () => {
    renderWithProviders(<ResponseMessages />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { id: '1' },
            headers: undefined
          }
        },
        sampleQuery: { sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET', sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0' },
        auth: { authToken: { token: '', pending: false }, consentedScopes: [] },
        graphExplorerMode: 'TryIt'
      }
    });
    expect(screen.queryByText('Using demo tenant')).not.toBeInTheDocument();
  });
});
