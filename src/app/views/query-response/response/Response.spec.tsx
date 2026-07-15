import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../../test-utils';
import Response from './Response';

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { logIn: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn() }
}));
jest.mock('./ResponseDisplay', () => ({
  __esModule: true,
  default: () => <div data-testid="response-display" />
}));
jest.mock('./ResponseMessages', () => ({
  ResponseMessages: () => <div data-testid="response-messages" />
}));
jest.mock('../../../services/actions/query-action-creator-util', () => ({
  getContentType: jest.fn().mockReturnValue('application/json')
}));
jest.mock('@fluentui/react-components', () => ({
  makeStyles: () => () => ({ container: '', messageBars: '' }),
  tokens: { spacingHorizontalMNudge: '4px' }
}));

describe('Response component', () => {
  it('renders ResponseMessages', () => {
    renderWithProviders(<Response />);
    expect(screen.getByTestId('response-messages')).toBeTruthy();
  });

  it('renders ResponseDisplay when headers exist and no contentDownloadUrl', () => {
    renderWithProviders(<Response />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { data: 'test' },
            headers: { 'content-type': 'application/json' }
          }
        }
      }
    });
    expect(screen.getByTestId('response-display')).toBeTruthy();
  });

  it('does not render ResponseDisplay when body has contentDownloadUrl', () => {
    renderWithProviders(<Response />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { contentDownloadUrl: 'https://example.com/download' },
            headers: { 'content-type': 'application/json' }
          }
        }
      }
    });
    expect(screen.queryByTestId('response-display')).toBeNull();
  });

  it('does not render ResponseDisplay when body has throwsCorsError', () => {
    renderWithProviders(<Response />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { throwsCorsError: true },
            headers: { 'content-type': 'application/json' }
          }
        }
      }
    });
    expect(screen.queryByTestId('response-display')).toBeNull();
  });

  it('does not render ResponseDisplay when headers are undefined', () => {
    renderWithProviders(<Response />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: { data: 'test' },
            headers: undefined
          }
        }
      }
    });
    expect(screen.queryByTestId('response-display')).toBeNull();
  });
});
