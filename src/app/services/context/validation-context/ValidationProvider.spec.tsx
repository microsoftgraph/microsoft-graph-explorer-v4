import React, { useContext } from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));

const mockValidate = jest.fn();
jest.mock('../../../../modules/validation/validation-service', () => ({
  ValidationService: { validate: mockValidate }
}));

jest.mock('../../../utils/sample-url-generation', () => ({
  parseSampleUrl: jest.fn((url: string) => {
    if (url.includes('beta')) return { queryVersion: 'beta' };
    return { queryVersion: 'v1.0' };
  })
}));

import { ValidationProvider } from './ValidationProvider';
import { ValidationContext } from './ValidationContext';
import { renderWithProviders } from '../../../../test-utils';

function TestConsumer() {
  const ctx = useContext(ValidationContext);
  return (
    <div>
      <span data-testid="isValid">{String(ctx.isValid)}</span>
      <span data-testid="query">{ctx.query}</span>
      <span data-testid="error">{ctx.error}</span>
      <span data-testid="hasValidate">{typeof ctx.validate === 'function' ? 'yes' : 'no'}</span>
      <button data-testid="validate-btn" onClick={() => ctx.validate('https://graph.microsoft.com/v1.0/me')}>
        Validate
      </button>
      <button data-testid="validate-invalid-btn" onClick={() => ctx.validate('https://graph.microsoft.com/v1.0/invalid')}>
        Validate Invalid
      </button>
    </div>
  );
}

describe('ValidationProvider', () => {
  const resourcesState = {
    resources: {
      pending: false,
      data: {
        'v1.0': { children: [{ segment: '/users', labels: [], version: 'v1.0' }] },
        'beta': { children: [{ segment: '/users', labels: [], version: 'beta' }] }
      },
      error: null
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    renderWithProviders(
      <ValidationProvider>
        <div>child content</div>
      </ValidationProvider>,
      { preloadedState: resourcesState }
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('provides context value with expected shape', () => {
    renderWithProviders(
      <ValidationProvider>
        <TestConsumer />
      </ValidationProvider>,
      { preloadedState: resourcesState }
    );
    expect(screen.getByTestId('isValid')).toHaveTextContent('false');
    expect(screen.getByTestId('query')).toHaveTextContent('');
    expect(screen.getByTestId('error')).toHaveTextContent('');
    expect(screen.getByTestId('hasValidate')).toHaveTextContent('yes');
  });

  it('sets isValid to true when validation succeeds', () => {
    mockValidate.mockImplementation(() => { /* no throw = valid */ });
    renderWithProviders(
      <ValidationProvider>
        <TestConsumer />
      </ValidationProvider>,
      { preloadedState: resourcesState }
    );
    act(() => {
      fireEvent.click(screen.getByTestId('validate-btn'));
    });
    expect(screen.getByTestId('isValid')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('sets isValid to false and error when validation throws error', () => {
    mockValidate.mockImplementation(() => {
      const err: any = new Error('Invalid URL segment');
      err.type = 'error';
      throw err;
    });
    renderWithProviders(
      <ValidationProvider>
        <TestConsumer />
      </ValidationProvider>,
      { preloadedState: resourcesState }
    );
    act(() => {
      fireEvent.click(screen.getByTestId('validate-invalid-btn'));
    });
    expect(screen.getByTestId('isValid')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('Invalid URL segment');
  });

  it('sets isValid to true when validation throws warning', () => {
    mockValidate.mockImplementation(() => {
      const err: any = new Error('Deprecated endpoint');
      err.type = 'warning';
      throw err;
    });
    renderWithProviders(
      <ValidationProvider>
        <TestConsumer />
      </ValidationProvider>,
      { preloadedState: resourcesState }
    );
    act(() => {
      fireEvent.click(screen.getByTestId('validate-btn'));
    });
    expect(screen.getByTestId('isValid')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('Deprecated endpoint');
  });

  it('handles empty resources data', () => {
    renderWithProviders(
      <ValidationProvider>
        <TestConsumer />
      </ValidationProvider>,
      { preloadedState: { resources: { pending: false, data: {}, error: null } } }
    );
    expect(screen.getByTestId('hasValidate')).toHaveTextContent('yes');
  });
});
