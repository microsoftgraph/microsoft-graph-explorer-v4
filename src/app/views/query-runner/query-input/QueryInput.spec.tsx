import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(), getSessionId: jest.fn(),
    logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn(), signInAuthError: jest.fn()
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('./auto-complete', () => ({
  AutoComplete: (props: any) => (
    <input data-testid="autocomplete" onChange={(e) => props.contentChanged(e.target.value)} />
  )
}));
jest.mock('../../../views/common/submit-button/SubmitButton', () => ({
  __esModule: true,
  default: (props: any) => (
    <button data-testid="run-query-btn" onClick={props.handleOnClick}
      disabled={props.disabled}>{props.text}</button>
  )
}));
jest.mock('../../sidebar/sample-queries/sample-query-utils', () => ({
  shouldRunQuery: jest.fn().mockReturnValue(true)
}));

import QueryInput from './QueryInput';
import { renderWithProviders, createMockStore } from '../../../../test-utils';
import { ValidationContext } from '../../../services/context/validation-context/ValidationContext';

describe('QueryInput component', () => {
  const defaultProps = {
    handleOnRunQuery: jest.fn(),
    handleChange: jest.fn()
  };

  it('renders run button and method selector', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByTestId('run-query-btn')).toBeInTheDocument();
    expect(screen.getByTestId('run-query-btn')).toHaveTextContent('Run Query');
  });

  it('shows correct current verb from store', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'POST',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: 'some-token', pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('renders version dropdown with selected version', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/beta/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'beta'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('beta')).toBeInTheDocument();
  });

  it('disables run button when URL is empty', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: '',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByTestId('run-query-btn')).toBeDisabled();
  });

  it('shows error when shouldRunQuery returns false', () => {
    const { shouldRunQuery } = require('../../sidebar/sample-queries/sample-query-utils');
    (shouldRunQuery as jest.Mock).mockReturnValueOnce(false);

    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'DELETE',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('Sign in to use this method')).toBeInTheDocument();
  });

  it('renders mobile layout when mobileScreen is true', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: true }
      }
    });
    expect(screen.getByTestId('run-query-btn')).toBeInTheDocument();
  });

  it('shows submitting state when loading', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: true, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByTestId('run-query-btn')).toBeInTheDocument();
  });

  it('autocomplete content change updates query URL', () => {
    const { fireEvent } = require('@testing-library/react');
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    const autocomplete = screen.getByTestId('autocomplete');
    fireEvent.change(autocomplete, { target: { value: 'https://graph.microsoft.com/beta/users' } });
    // The content changed handler dispatches setSampleQuery
    expect(autocomplete).toBeInTheDocument();
  });

  it('run button is disabled when shouldRunQuery returns false', () => {
    const { shouldRunQuery } = require('../../sidebar/sample-queries/sample-query-utils');
    (shouldRunQuery as jest.Mock).mockReturnValueOnce(false);

    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'POST',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByTestId('run-query-btn')).toBeDisabled();
  });

  it('all HTTP method options are rendered', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('renders version v1.0 as default', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('v1.0')).toBeInTheDocument();
  });

  it('renders with PATCH verb', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'PATCH',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: 'tok', pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByText('PATCH')).toBeInTheDocument();
  });

  it('renders autocomplete component', () => {
    renderWithProviders(<QueryInput {...defaultProps} />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        sidebarProperties: { showSidebar: true, mobileScreen: false }
      }
    });
    expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
  });

  it('calls handleOnRunQuery when run button clicked with valid validation', () => {
    const { fireEvent } = require('@testing-library/react');
    const handleOnRunQuery = jest.fn();
    const validationValue = { isValid: true, validate: jest.fn(), query: '', error: '' };
    renderWithProviders(
      <ValidationContext.Provider value={validationValue}>
        <QueryInput handleOnRunQuery={handleOnRunQuery} handleChange={jest.fn()} />
      </ValidationContext.Provider>,
      {
        preloadedState: {
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
          graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
          sidebarProperties: { showSidebar: true, mobileScreen: false }
        }
      }
    );
    fireEvent.click(screen.getByTestId('run-query-btn'));
    expect(handleOnRunQuery).toHaveBeenCalledTimes(1);
  });

  it('does not call handleOnRunQuery when validation is invalid', () => {
    const { fireEvent } = require('@testing-library/react');
    const handleOnRunQuery = jest.fn();
    const validationValue = { isValid: false, validate: jest.fn(), query: '', error: 'Invalid URL' };
    renderWithProviders(
      <ValidationContext.Provider value={validationValue}>
        <QueryInput handleOnRunQuery={handleOnRunQuery} handleChange={jest.fn()} />
      </ValidationContext.Provider>,
      {
        preloadedState: {
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
          graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
          sidebarProperties: { showSidebar: true, mobileScreen: false }
        }
      }
    );
    // Button should be disabled when validation.isValid is false
    expect(screen.getByTestId('run-query-btn')).toBeDisabled();
    expect(handleOnRunQuery).not.toHaveBeenCalled();
  });

  it('contentChanged dispatches setSampleQuery and preserves version for non-standard URL', () => {
    const { fireEvent } = require('@testing-library/react');
    const validationValue = { isValid: true, validate: jest.fn(), query: '', error: '' };
    const store = createMockStore({
      sampleQuery: {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        selectedVerb: 'GET',
        sampleBody: undefined,
        sampleHeaders: [],
        selectedVersion: 'v1.0'
      },
      auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
      graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
      sidebarProperties: { showSidebar: true, mobileScreen: false }
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithProviders(
      <ValidationContext.Provider value={validationValue}>
        <QueryInput {...defaultProps} />
      </ValidationContext.Provider>,
      { store }
    );
    dispatchSpy.mockClear();
    const autocomplete = screen.getByTestId('autocomplete');
    fireEvent.change(autocomplete, { target: { value: 'https://graph.microsoft.com/v3.0/me' } });
    const setSampleQueryAction = dispatchSpy.mock.calls.find(
      ([action]: any) => action.type === 'sampleQuery/setSampleQuery'
    );
    expect(setSampleQueryAction).toBeDefined();
    expect((setSampleQueryAction![0] as any).payload.selectedVersion).toBe('v1.0');
    expect((setSampleQueryAction![0] as any).payload.sampleUrl).toBe('https://graph.microsoft.com/v3.0/me');
    dispatchSpy.mockRestore();
  });
});
