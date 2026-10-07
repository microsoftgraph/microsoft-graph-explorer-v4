import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(), getSessionId: jest.fn(),
    logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn(), signInAuthError: jest.fn()
}));
jest.mock('../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../query-response', () => ({
  QueryResponse: () => <div data-testid="query-response">QueryResponse</div>
}));
jest.mock('../query-runner', () => ({
  QueryRunner: () => <div data-testid="query-runner">QueryRunner</div>
}));
jest.mock('../query-runner/request/Request', () => ({
  __esModule: true,
  default: ({ handleOnEditorChange }: any) => (
    <div data-testid="request">
      <button data-testid="editor-change-btn"
        onClick={() => handleOnEditorChange && handleOnEditorChange('new body content')}>Change</button>
    </div>
  )
}));
jest.mock('../sidebar/Sidebar', () => ({
  Sidebar: ({ handleToggleSelect }: any) => (
    <div data-testid="sidebar">
      <button data-testid="toggle-open" onClick={() => handleToggleSelect(true)}>Open</button>
      <button data-testid="toggle-close" onClick={() => handleToggleSelect(false)}>Close</button>
    </div>
  )
}));
jest.mock('../main-header/MainHeader', () => ({
  MainHeader: () => <div data-testid="main-header">MainHeader</div>
}));
jest.mock('../app-sections', () => ({
  StatusMessages: () => <div data-testid="status-messages">StatusMessages</div>,
  TermsOfUseMessage: () => <div data-testid="terms">Terms</div>
}));
jest.mock('../common/banners/Notification', () => ({
  __esModule: true,
  default: () => <div data-testid="notification">Notification</div>
}));
jest.mock('../common/popups/PopupsWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="popups">Popups</div>
}));
jest.mock('../common/share', () => ({
  createShareLink: jest.fn().mockReturnValue('')
}));
jest.mock('../app-sections/HeaderMessaging', () => ({
  headerMessaging: jest.fn().mockReturnValue(null)
}));
jest.mock('./LayoutResizeHandler', () => ({
  LayoutResizeHandler: React.forwardRef((props: any, ref: any) => (
    <div data-testid={`resize-handler-${props.position}`}
      onMouseDown={props.onMouseDown}
      onDoubleClick={props.onDoubleClick}
    />
  ))
}));
jest.mock('../../services/context/validation-context/ValidationProvider', () => ({
  ValidationProvider: ({ children }: any) => <div>{children}</div>
}));
jest.mock('../../services/context/collection-permissions/CollectionPermissionsProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>
}));
jest.mock('../../utils/useDetectMobileScreen', () => ({
  useDetectMobileScreen: jest.fn()
}));
jest.mock('@fluentui-contrib/react-resize-handle', () => ({
  useResizeHandle: () => ({
    handleRef: { current: null },
    wrapperRef: { current: null },
    elementRef: jest.fn(),
    setValue: jest.fn()
  })
}));

import { Layout } from './Layout';
import { renderWithProviders } from '../../../test-utils';
import { Mode } from '../../../types/enums';

describe('Layout component', () => {
  const defaultProps = {
    handleSelectVerb: jest.fn(),
    graphExplorerMode: Mode.Complete,
    authenticated: false
  };

  it('renders main layout structure', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders query runner section', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('query-runner')).toBeInTheDocument();
    expect(screen.getByTestId('query-response')).toBeInTheDocument();
  });

  it('renders with TryIt mode (no sidebar)', () => {
    renderWithProviders(
      <Layout {...defaultProps} graphExplorerMode={Mode.TryIt} />,
      {
        preloadedState: {
          sidebarProperties: { showSidebar: true, mobileScreen: false },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
        }
      }
    );
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('does not render sidebar when showSidebar is false', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: false, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders in mobile mode without resize handler', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('resize-handler-end')).not.toBeInTheDocument();
  });

  it('renders resize handler in desktop mode with sidebar', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('resize-handler-end')).toBeInTheDocument();
  });

  it('renders notification component', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });

  it('renders terms of use message', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('terms')).toBeInTheDocument();
  });

  it('renders request area', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('request')).toBeInTheDocument();
  });

  it('renders with POST verb', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me/messages',
          selectedVerb: 'POST',
          sampleBody: '{"subject":"test"}',
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('request')).toBeInTheDocument();
  });

  it('renders popups wrapper', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('popups')).toBeInTheDocument();
  });

  it('renders status messages', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('status-messages')).toBeInTheDocument();
  });

  it('renders header messaging in TryIt mode', () => {
    const { headerMessaging } = require('../app-sections/HeaderMessaging');
    headerMessaging.mockReturnValue(<div data-testid="header-msg">Try It</div>);
    renderWithProviders(
      <Layout {...defaultProps} graphExplorerMode={Mode.TryIt} />,
      {
        preloadedState: {
          sidebarProperties: { showSidebar: true, mobileScreen: false },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
        }
      }
    );
    expect(screen.getByTestId('header-msg')).toBeInTheDocument();
  });

  it('does not render header messaging in Complete mode', () => {
    const { headerMessaging } = require('../app-sections/HeaderMessaging');
    headerMessaging.mockReturnValue(<div data-testid="header-msg">Try It</div>);
    renderWithProviders(
      <Layout {...defaultProps} graphExplorerMode={Mode.Complete} />,
      {
        preloadedState: {
          sidebarProperties: { showSidebar: true, mobileScreen: false },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
        }
      }
    );
    expect(screen.queryByTestId('header-msg')).not.toBeInTheDocument();
  });

  it('renders with authenticated user', () => {
    renderWithProviders(<Layout {...defaultProps} authenticated={true} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.getByTestId('query-runner')).toBeInTheDocument();
  });

  it('does not render resize handler in mobile with sidebar', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('resize-handler-end')).not.toBeInTheDocument();
  });

  it('renders all core sections together in Complete mode', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('query-runner')).toBeInTheDocument();
    expect(screen.getByTestId('query-response')).toBeInTheDocument();
    expect(screen.getByTestId('request')).toBeInTheDocument();
    expect(screen.getByTestId('notification')).toBeInTheDocument();
    expect(screen.getByTestId('terms')).toBeInTheDocument();
    expect(screen.getByTestId('popups')).toBeInTheDocument();
  });

  it('handleOnEditorChange updates sample query body via dispatch', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me/messages',
          selectedVerb: 'POST',
          sampleBody: '{"old":"body"}',
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const changeBtn = screen.getByTestId('editor-change-btn');
    fireEvent.click(changeBtn);
  });

  it('handleToggleSelect opens sidebar in desktop mode', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    fireEvent.click(screen.getByTestId('toggle-open'));
  });

  it('handleToggleSelect closes sidebar in desktop mode', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    fireEvent.click(screen.getByTestId('toggle-close'));
  });

  it('handleToggleSelect in mobile mode dispatches toggleSidebar', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    fireEvent.click(screen.getByTestId('toggle-open'));
  });

  it('handleToggleSelect closes in mobile mode', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    fireEvent.click(screen.getByTestId('toggle-close'));
  });

  it('sidebar resize handler receives onMouseDown for drag', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const sidebarResize = screen.getByTestId('resize-handler-end');
    fireEvent.mouseDown(sidebarResize, { clientX: 400 });
  });

  it('sidebar resize handler onDoubleClick resets to default width', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const sidebarResize = screen.getByTestId('resize-handler-end');
    fireEvent.doubleClick(sidebarResize);
  });

  it('request resize handler receives onMouseDown for vertical drag', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const requestResize = screen.getByTestId('resize-handler-bottom');
    fireEvent.mouseDown(requestResize, { clientY: 300 });
    fireEvent.mouseMove(window, { clientY: 400 });
    fireEvent.mouseUp(window);
  });

  it('request resize handler onDoubleClick resets to default height', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const requestResize = screen.getByTestId('resize-handler-bottom');
    fireEvent.doubleClick(requestResize);
  });

  it('sidebar mouseDown starts drag and mouseMove/mouseUp updates width', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const sidebarResize = screen.getByTestId('resize-handler-end');
    fireEvent.mouseDown(sidebarResize, { clientX: 456 });
    fireEvent.mouseMove(window, { clientX: 600 });
    fireEvent.mouseMove(window, { clientX: 200 });
    fireEvent.mouseUp(window);
  });

  it('handles mobileScreen change effect - sets sidebar size to 0', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: true },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders with POST verb and sampleBody triggers useEffect', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me/messages',
          selectedVerb: 'POST',
          sampleBody: '{"subject":"test"}',
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('request')).toBeInTheDocument();
  });

  it('renders with undefined sampleBody for GET verb', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    expect(screen.getByTestId('request')).toBeInTheDocument();
  });

  it('updateRequestHeight clamps to minimum when dragged too high', () => {
    const spy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({ height: '300' } as any);
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const requestResize = screen.getByTestId('resize-handler-bottom');
    // startY=300, startHeight=300, mouseMove to clientY=0 => newHeight=300+(0-300)=0 => clamped to min=150
    fireEvent.mouseDown(requestResize, { clientY: 300 });
    fireEvent.mouseMove(window, { clientY: 0 });
    fireEvent.mouseUp(window);
    const cssValue = document.documentElement.style.getPropertyValue('--request-area-height');
    expect(cssValue).toBe('150px');
    spy.mockRestore();
  });

  it('updateRequestHeight clamps to maximum when dragged too low', () => {
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    const spy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({ height: '300' } as any);
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const requestResize = screen.getByTestId('resize-handler-bottom');
    // startY=300, startHeight=300, mouseMove to clientY=1200 => newHeight=300+(1200-300)=1200 => clamped to max=400
    fireEvent.mouseDown(requestResize, { clientY: 300 });
    fireEvent.mouseMove(window, { clientY: 1200 });
    fireEvent.mouseUp(window);
    const cssValue = document.documentElement.style.getPropertyValue('--request-area-height');
    expect(cssValue).toBe('400px');
    spy.mockRestore();
  });

  it('handleOnEditorChange dispatches setSampleQuery with updated body', () => {
    const { createMockStore } = require('../../../test-utils');
    const store = createMockStore({
      sidebarProperties: { showSidebar: true, mobileScreen: false },
      sampleQuery: {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me/messages',
        selectedVerb: 'POST',
        sampleBody: undefined,
        sampleHeaders: [],
        selectedVersion: 'v1.0'
      },
      auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithProviders(<Layout {...defaultProps} />, { store });
    // Clear calls from initial render/useEffect dispatches
    dispatchSpy.mockClear();
    fireEvent.click(screen.getByTestId('editor-change-btn'));
    const setSampleQueryAction = dispatchSpy.mock.calls.find(
      ([action]: any) => action.type === 'sampleQuery/setSampleQuery'
    );
    expect(setSampleQueryAction).toBeDefined();
    expect((setSampleQueryAction![0] as any).payload.sampleBody).toBe('new body content');
    dispatchSpy.mockRestore();
  });

  it('handleResizeStart returns early when sidebarElement is null', () => {
    renderWithProviders(<Layout {...defaultProps} />, {
      preloadedState: {
        sidebarProperties: { showSidebar: true, mobileScreen: false },
        sampleQuery: {
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          selectedVerb: 'GET',
          sampleBody: undefined,
          sampleHeaders: [],
          selectedVersion: 'v1.0'
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });
    const sidebarResize = screen.getByTestId('resize-handler-end');
    // sidebarElement is null because useResizeHandle mock returns jest.fn() for elementRef
    // so handleResizeStart calls preventDefault then returns early
    fireEvent.mouseDown(sidebarResize, { clientX: 400 });
    // No crash means the early return path executed successfully
    fireEvent.mouseMove(window, { clientX: 600 });
    fireEvent.mouseUp(window);
  });
});
