jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackReactComponent: jest.fn((c: any) => c),
    trackTabClickEvent: jest.fn()
  },
  eventTypes: {}, componentNames: {}
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    getAccount: jest.fn(),
    getToken: jest.fn().mockResolvedValue({ accessToken: 'mock-token' }),
    logIn: jest.fn(),
    consentToScopes: jest.fn()
  }
}));

jest.mock('../../../utils/graph-toolkit-lookup', () => ({
  lookupToolkitUrl: jest.fn().mockReturnValue({ toolkitUrl: null, exampleUrl: null })
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import GraphToolkit from './GraphToolkit';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';

describe('GraphToolkit', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders fallback when no toolkit URL found', () => {
    renderWithProviders(<GraphToolkit />);
    expect(screen.getByText('We did not find a Graph toolkit for this query')).toBeTruthy();
  });

  it('renders iframe when toolkit URL is found', () => {
    (lookupToolkitUrl as jest.Mock).mockReturnValue({
      toolkitUrl: 'https://mgt.dev/iframe',
      exampleUrl: 'https://mgt.dev/example'
    });
    renderWithProviders(<GraphToolkit />);
    expect(screen.getByTitle('Graph toolkit')).toBeTruthy();
  });

  it('renders playground link when toolkit URL is found', () => {
    (lookupToolkitUrl as jest.Mock).mockReturnValue({
      toolkitUrl: 'https://mgt.dev/iframe',
      exampleUrl: 'https://mgt.dev/example'
    });
    renderWithProviders(<GraphToolkit />);
    expect(screen.getByText('graph toolkit playground')).toBeTruthy();
  });
});
