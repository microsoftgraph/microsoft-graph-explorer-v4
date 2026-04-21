import '@testing-library/jest-dom';

jest.mock('../../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));

jest.mock('./documentation', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue(null)
    }))
  };
});
jest.mock('../../share-query/ShareButton', () => {
  const MockShareButton = () => <div data-testid="share-button">Share</div>;
  MockShareButton.displayName = 'ShareButton';
  return { __esModule: true, default: MockShareButton };
});
jest.mock('../../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../../utils/external-link-validation', () => ({
  validateExternalLink: jest.fn()
}));
jest.mock('../../../../../utils/query-url-sanitization', () => ({
  sanitizeQueryUrl: jest.fn((url: string) => url)
}));
jest.mock('../../../../../utils/sample-url-generation', () => ({
  parseSampleUrl: jest.fn().mockReturnValue({ requestUrl: '/me', queryVersion: 'v1.0' })
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../test-utils';
import SuffixRenderer from './SuffixRenderer';
import DocumentationService from './documentation';

describe('SuffixRenderer', () => {
  it('renders without crashing', () => {
    renderWithProviders(<SuffixRenderer />);
    expect(screen.getByLabelText('Query documentation not found')).toBeInTheDocument();
  });

  it('renders doc button as disabled when no link available', () => {
    renderWithProviders(<SuffixRenderer />);
    const docButton = screen.getByLabelText('Query documentation not found');
    expect(docButton).toBeDisabled();
  });

  it('renders share button', () => {
    renderWithProviders(<SuffixRenderer />);
    expect(screen.getByTestId('share-button')).toBeInTheDocument();
  });

  it('renders enabled doc button when documentation link is available', () => {
    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue('https://docs.microsoft.com/graph/api/user-get')
    }));

    renderWithProviders(<SuffixRenderer />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        samples: { queries: [{ docLink: 'https://docs.microsoft.com/graph/api/user-get' }], pending: false },
        resources: { pending: false, data: {}, error: null }
      }
    });

    const docButton = screen.getByLabelText('Read documentation');
    expect(docButton).not.toBeDisabled();

    // Restore
    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue(null)
    }));
  });

  it('clicking enabled doc button opens window and tracks event', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { telemetry } = require('../../../../../../telemetry');

    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue('https://docs.microsoft.com/graph/api/user-get')
    }));

    renderWithProviders(<SuffixRenderer />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        samples: { queries: [], pending: false },
        resources: { pending: false, data: {}, error: null }
      }
    });

    const docButton = screen.getByLabelText('Read documentation');
    fireEvent.click(docButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://docs.microsoft.com/graph/api/user-get'),
      '_blank'
    );
    expect(telemetry.trackEvent).toHaveBeenCalled();

    windowOpenSpy.mockRestore();
    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue(null)
    }));
  });

  it('appends WT.mc_id parameter with ? when URL has no query string', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue('https://docs.microsoft.com/graph/api/user-get')
    }));

    renderWithProviders(<SuffixRenderer />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        samples: { queries: [], pending: false },
        resources: { pending: false, data: {}, error: null }
      }
    });

    fireEvent.click(screen.getByLabelText('Read documentation'));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://docs.microsoft.com/graph/api/user-get?WT.mc_id=msgraph_inproduct_graphexhelp',
      '_blank'
    );

    windowOpenSpy.mockRestore();
    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue(null)
    }));
  });

  it('appends WT.mc_id parameter with & when URL already has query string', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue('https://docs.microsoft.com/graph/api/user-get?tab=http')
    }));

    renderWithProviders(<SuffixRenderer />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        samples: { queries: [], pending: false },
        resources: { pending: false, data: {}, error: null }
      }
    });

    fireEvent.click(screen.getByLabelText('Read documentation'));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://docs.microsoft.com/graph/api/user-get?tab=http&WT.mc_id=msgraph_inproduct_graphexhelp',
      '_blank'
    );

    windowOpenSpy.mockRestore();
    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue(null)
    }));
  });

  it('uses resources data when selectedVersion matches', () => {
    (DocumentationService as jest.Mock).mockImplementation(() => ({
      getDocumentationLink: jest.fn().mockReturnValue(null)
    }));

    renderWithProviders(<SuffixRenderer />, {
      preloadedState: {
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        samples: { queries: [], pending: false },
        resources: {
          pending: false,
          data: { 'v1.0': { children: [{ segment: 'users' }], segment: '/', labels: [], version: 'v1.0' } },
          error: null
        }
      }
    });

    expect(DocumentationService).toHaveBeenCalled();
  });
});
