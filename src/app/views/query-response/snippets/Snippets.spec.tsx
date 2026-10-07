import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
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
  componentNames: { CODE_SNIPPETS_TAB: 'code-snippets', CODE_SNIPPET_LANGUAGES: {} },
  eventTypes: {},
  errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../services/slices/snippet.slice', () => ({
  __esModule: true,
  default: (state = {}) => state,
  getSnippet: jest.fn(() => ({ type: 'snippets/get' })),
  setSnippetTabSuccess: jest.fn((tab: string) => ({ type: 'snippets/setTab', payload: tab }))
}));
jest.mock('../../../services/context/validation-context/ValidationContext', () => {
  const { createContext } = require('react');
  return { ValidationContext: createContext({ isValid: true }) };
});
jest.mock('../../common', () => ({
  Monaco: ({ body, extraInfoElement }: any) => <div data-testid="monaco">{body}{extraInfoElement}</div>
}));
jest.mock('../../common/copy', () => ({
  copyAndTrackText: jest.fn()
}));
jest.mock('../../common/lazy-loader/component-registry', () => ({
  CopyButton: ({ handleOnClick }: any) => <button data-testid="copy-btn" onClick={handleOnClick}>Copy</button>
}));

import Snippets from './Snippets';

describe('Snippets', () => {
  it('renders snippet tabs', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'var client = new GraphClient();' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('C#')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Go' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Java' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'JavaScript' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'PHP' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'PowerShell' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Python' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: true,
          data: {},
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('Fetching code snippet')).toBeInTheDocument();
  });

  it('handles snippet not available', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: {},
          snippetTab: 'CSharp',
          error: { status: 404 }
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('Snippet not available!')).toBeInTheDocument();
  });

  it('shows invalid URL message when validation context is invalid', () => {
    const { ValidationContext } = require('../../../services/context/validation-context/ValidationContext');

    const { render } = require('@testing-library/react');
    const { Provider } = require('react-redux');
    const { configureStore, createSlice } = require('@reduxjs/toolkit');

    const snippetsSlice = createSlice({
      name: 'snippets',
      initialState: { pending: false, data: {}, snippetTab: 'CSharp', error: null },
      reducers: {}
    });
    const sampleQuerySlice = createSlice({
      name: 'sampleQuery',
      initialState: {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me', selectedVerb: 'GET',
        sampleBody: undefined, sampleHeaders: [], selectedVersion: 'v1.0'
      },
      reducers: {}
    });

    const store = configureStore({
      reducer: {
        snippets: snippetsSlice.reducer,
        sampleQuery: sampleQuerySlice.reducer
      }
    });

    render(
      <Provider store={store}>
        <ValidationContext.Provider value={{ isValid: false }}>
          <Snippets />
        </ValidationContext.Provider>
      </Provider>
    );

    expect(screen.getByText('Invalid URL!')).toBeInTheDocument();
  });

  it('displays snippet content in Monaco editor', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'GraphServiceClient client = new GraphServiceClient();' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByTestId('monaco')).toBeInTheDocument();
    expect(screen.getByTestId('monaco').textContent).toContain('GraphServiceClient');
  });

  it('shows copy button', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'var client = new GraphClient();' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByTestId('copy-btn')).toBeInTheDocument();
  });

  it('handles copy button click', () => {
    const { copyAndTrackText } = require('../../common/copy');
    const { fireEvent } = require('@testing-library/react');

    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'var client = new GraphClient();' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    fireEvent.click(screen.getByTestId('copy-btn'));
    expect(copyAndTrackText).toHaveBeenCalled();
  });

  it('handles 400 error status', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: {},
          snippetTab: 'CSharp',
          error: { status: 400 }
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('Snippet not available!')).toBeInTheDocument();
  });

  it('shows empty snippet when data has no matching language', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { java: 'some java code' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    // Monaco should be present but empty
    expect(screen.getByTestId('monaco')).toBeInTheDocument();
  });

  it('renders tabs for all supported languages', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: {},
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('C#')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Go' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Java' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'JavaScript' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'PHP' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'PowerShell' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Python' })).toBeInTheDocument();
  });

  it('switches tab and dispatches actions', () => {
    const { fireEvent } = require('@testing-library/react');
    const { setSnippetTabSuccess, getSnippet } = require('../../../services/slices/snippet.slice');

    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'code' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    const goTab = screen.getByRole('tab', { name: 'Go' });
    fireEvent.click(goTab);

    expect(setSnippetTabSuccess).toHaveBeenCalledWith('Go');
    expect(getSnippet).toHaveBeenCalledWith('go');
  });

  it('shows snippet not available for 404 error with no data', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: {},
          snippetTab: 'Go',
          error: { status: 404 }
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('Snippet not available!')).toBeInTheDocument();
  });

  it('does not show spinner when error is present but loading', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: true,
          data: {},
          snippetTab: 'CSharp',
          error: { status: 400 }
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    // When pending=true and error exists: showSpinner = false, notAvailable = false
    expect(screen.queryByText('Fetching code snippet')).not.toBeInTheDocument();
  });

  it('renders extra snippet info with SDK links for CSharp', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'var client = new GraphClient();' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    // Extra info contains SDK links
    expect(screen.getByText('https://aka.ms/csharpsdk')).toBeInTheDocument();
    expect(screen.getByText('https://aka.ms/sdk-doc')).toBeInTheDocument();
  });

  it('renders extra snippet info for PowerShell with # comment', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { powershell: 'Get-MgUser' },
          snippetTab: 'PowerShell',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('https://aka.ms/pshellsdk')).toBeInTheDocument();
  });

  it('renders extra snippet info for Python with # comment', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { python: 'import msgraph' },
          snippetTab: 'Python',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('https://aka.ms/msgraphpythonsdk')).toBeInTheDocument();
  });

  it('renders extra snippet info for Java', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { java: 'GraphServiceClient client;' },
          snippetTab: 'Java',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('https://aka.ms/graphjavasdk')).toBeInTheDocument();
  });

  it('does not render extra info for unknown language', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { ruby: 'puts "hello"' },
          snippetTab: 'Ruby',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    // No extra-info section should exist for unsupported languages
    expect(screen.queryByText('https://aka.ms/')).not.toBeInTheDocument();
  });

  it('tracks link click event on SDK download link', () => {
    const { telemetry } = require('../../../../telemetry');
    const { fireEvent } = require('@testing-library/react');

    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: false,
          data: { csharp: 'var client = new GraphClient();' },
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    const sdkLink = screen.getByText('https://aka.ms/csharpsdk');
    fireEvent.click(sdkLink);
    expect(telemetry.trackLinkClickEvent).toHaveBeenCalled();
  });

  it('shows loading spinner when pending and no error', () => {
    renderWithProviders(<Snippets />, {
      preloadedState: {
        snippets: {
          pending: true,
          data: {},
          snippetTab: 'CSharp',
          error: null
        },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        }
      }
    });

    expect(screen.getByText('Fetching code snippet')).toBeInTheDocument();
  });
});
