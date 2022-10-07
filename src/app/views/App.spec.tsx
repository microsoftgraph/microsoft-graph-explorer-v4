import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import App from '../../app/views/App';
import { Mode } from '../../types/enums';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { geLocale } from '../../appLocale';
import messages from '../../messages';
import { initializeIcons } from '@fluentui/react';

const renderApp = (args?: any) : any => {
  initializeIcons();
  const defaultProps = {
    profile: null,
    queryState: null,
    termsOfUse: true,
    graphExplorerMode: args.mode || Mode.Complete,
    sidebarProperties: {mobileScreen: args?.mobileScreen, showSidebar: args?.showSidebar},
    sampleQuery: {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: []
    },
    authenticated: false,
    actions: {
      clearQueryStatus: jest.fn(), //Change the return value of mock to simulate actions
      clearTermsOfUse: jest.fn(),
      setSampleQuery: jest.fn(),
      runQuery: jest.fn(),
      toggleSidebar: jest.fn(),
      signIn: jest.fn(),
      storeScopes: jest.fn(),
      changeTheme: jest.fn()
    }
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
  const props = {...args, ...defaultProps};
  const appStore: any = store;

  return render(
    <Provider store={appStore}>
      <IntlProvider
        locale={geLocale}
        messages={(messages as { [key: string]: object })[geLocale]}
      >
        <App {...props} />
      </IntlProvider>
    </Provider> );
}
window.fetch = jest.fn();
window.open = jest.fn();


// eslint-disable-next-line react/display-name
jest.mock('../../app/views/query-runner/request/feedback/FeedbackForm.tsx', () => () => {
  return <div />;
});

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}));

// eslint-disable-next-line no-console
console.warn = jest.fn();

describe('App rendering', () => {
  it('should confirm that all the major sections of the app are rendered', async () => {
    renderApp({mobileScreen: false, showSidebar: true});
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /settings/i })).toBeDefined();
    expect(screen.getByText(/tenant/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /help improve graph explorer/i })).toBeDefined();

    // confirm that sidebar items are rendered
    expect(screen.getByRole('tab', { name: /sample queries/i} )).toBeDefined();
    expect(screen.getByRole('tab', { name: /history/i} )).toBeDefined();
    expect(screen.getByRole('tab', { name: /resources/i} )).toBeDefined();

    expect(screen.getByRole('combobox', { name: /http request method option/i })).toBeDefined()
    expect(screen.getByRole('combobox', { name: /microsoft graph api version option/i })).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByRole('button', { name: /more info/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /run query/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /share query/i })).toBeDefined();

    expect(screen.getByRole('tab', { name: /request body/i } )).toBeDefined();
    expect(screen.getByRole('tab', { name: /request headers/i} )).toBeDefined();
    expect(screen.getByRole('tab', { name: /modify permissions/i})).toBeDefined();
    expect(screen.getByRole('tab', {name: /access token/i })).toBeDefined();

    // confirm that response section items are rendered
    expect(screen.getByRole('tab', { name: /response preview/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /response headers/i} )).toBeDefined();
    expect(screen.getByRole('tab', { name: /code snippets/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /toolkit component/i})).toBeDefined();
    expect(screen.getByRole('tab', { name: /adaptive cards/i})).toBeDefined();
    expect(screen.getByRole('tab', { name: /expand/i} )).toBeDefined();
  });

  it('should render http methods dropdown when the \'request method button\' is clicked', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const methodButton = screen.getByRole('combobox', { name: /http request method option/i });
    await user.click(methodButton);
    expect(screen.getByText(/post/i)).toBeDefined();
    expect(screen.getByText(/put/i)).toBeDefined();
    expect(screen.getByText(/delete/i)).toBeDefined();
    expect(screen.getByText(/patch/i)).toBeDefined();
  });

  it('should render the graph versions when the \'api versions button\' is clicked', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const versionButton = screen.getByRole('combobox', { name: /microsoft graph api version option/i });
    await user.click(versionButton);
    expect(screen.getAllByText(/v1.0/i)).toBeDefined();
    expect(screen.getAllByText(/beta/i)).toBeDefined();
  });

  it('should confirm that the query textbox is rendered', async () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    renderApp({ mobileScreen: false, showSidebar: true });
    expect(screen.getByRole('textbox')).toBeDefined();
  })

  it('should render the \'share query dialog box\' when the \'share query button\' is clicked', async () => {
    const user = userEvent.setup();
    renderApp({ mobileScreen: false, showSidebar: true });
    const shareQueryButton = screen.getByRole('button', { name: /share query/i });
    await user.click(shareQueryButton);
    expect(screen.getAllByText(/share query/i)).toBeDefined();
  })

  it('should render a dropdown of buttons when the \'settings button\' is clicked', async ()=> {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    await user.click(settingsButton);
    expect(screen.getByText(/change theme/i)).toBeDefined();
    expect(screen.getByText(/get a sandbox with sample data/i)).toBeDefined();
  });

  it('should confirm that a popup appears when the \'sign in button\' is clicked', async () => {
    const user = userEvent.setup();
    renderApp({ mobileScreen: false, showSidebar: true });
    const signInButton = screen.getByRole('button', { name: /sign in/i});
    await user.click(signInButton);
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledTimes(1);
  })

  it('should render samples tab and its children', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const samplesTab = screen.getByRole('tab', { name: /sample queries/i} );
    await user.click(samplesTab);
    expect(screen.getByRole('searchbox')).toBeDefined();
    expect(screen.getByText(/You are viewing a cached set of samples/i)).toBeDefined();
    expect(screen.getByText(/See more queries in/i)).toBeDefined();
  })

  it('should render resources tab and its children', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const resourcesButton = screen.getByRole('tab', { name: /resources/i });
    await user.click(resourcesButton);
    expect(screen.getByRole('switch', { name: /switch to beta/i})).toBeDefined();
    expect(screen.getByText(/Switch to beta/i)).toBeDefined();
    expect(screen.getByRole('searchbox')).toBeDefined();
    expect(screen.getByText(/resources available/i)).toBeDefined();
    expect(screen.getByText(/off/i)).toBeDefined();
  });

  it('should render the request headers tab and its children when request headers tab is clicked', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const requestHeadersTab = screen.getByRole('tab', { name: /request headers/i});
    await user.click(requestHeadersTab);
    expect(screen.getByPlaceholderText(/key/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/value/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /add/i})).toBeDefined();
    expect(screen.getByRole('columnheader', { name: /key/i})).toBeDefined();
    expect(screen.getByRole('columnheader', { name: /value/i})).toBeDefined();
    expect(screen.getByRole('columnheader', { name: /actions/i})).toBeDefined();
  });

  it('should render the permissions tab and its children when the modify permissions tab is clicked', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const modifyPermissionsTab = screen.getByRole('tab', { name: /modify permissions/i });
    await user.click(modifyPermissionsTab);
    expect(screen.getByText(/Permissions for the query are missing on this tab/i)).toBeDefined();
  });

  it('should render an expanded query response when expand pivot item is clicked', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const modifyPermissionsTab = screen.getByRole('tab', { name: /expand response/i});
    await user.click(modifyPermissionsTab);
    expect(screen.getByText(/response area expanded/i)).toBeDefined();
  });

  it('should run a query and display a status message on the status bar and a hint on the response body', async () => {
    const user = userEvent.setup();
    renderApp({ mobileScreen: false, showSidebar: true });
    const runQueryButton = screen.getByRole('button', { name: /run query/i });
    await user.click(runQueryButton);
    expect(screen.queryByText(/ok - 200/i)).toBeDefined();
    expect(screen.getByText(/you are currently using a sample account/i)).toBeDefined();
  });
})