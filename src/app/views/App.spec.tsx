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

// eslint-disable-next-line react/display-name
jest.mock('../../app/views/query-runner/request/feedback/FeedbackForm.tsx', () => () => {
  return <div />;
});

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}));

describe('It should render the main GE site', () => {
  it('Should confirm that all the major sections are rendered', async () => {
    renderApp({mobileScreen: false, showSidebar: true});
    screen.getByRole('button', { name: /sign in/i });
    screen.getByRole('button', { name: /settings/i });
    screen.getByText(/tenant/i);
    screen.getByRole('button', { name: /help improve graph explorer/i });

    // confirm that sidebar items are rendered
    screen.getByRole('tab', { name: /sample queries/i} );
    screen.getByRole('tab', { name: /history/i} );
    screen.getByRole('tab', { name: /resources/i} );

    screen.getByRole('combobox', { name: /http request method option/i })
    screen.getByRole('combobox', { name: /microsoft graph api version option/i });
    screen.getByRole('textbox');
    screen.getByRole('button', { name: /more info/i });
    screen.getByRole('button', { name: /run query/i });
    screen.getByRole('button', { name: /share query/i });

    screen.getByRole('tab', { name: /request body/i } );
    screen.getByRole('tab', { name: /request headers/i} );
    screen.getByRole('tab', { name: /modify permissions/i});
    screen.getByRole('tab', {name: /access token/i });

    // confirm that response section items are rendered
    screen.getByRole('tab', { name: /response preview/i });
    screen.getByRole('tab', { name: /response headers/i} );
    screen.getByRole('tab', { name: /code snippets/i });
    screen.getByRole('tab', { name: /toolkit component/i});
    screen.getByRole('tab', { name: /adaptive cards/i});
    screen.getByRole('tab', { name: /expand/i} );
  });

  it('Should test settings button', async ()=> {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    await user.click(settingsButton);
    expect(screen.getByText(/change theme/i)).toBeDefined();
    expect(screen.getByText(/get a sandbox with sample data/i)).toBeDefined();
  });

  it('should test samples tab', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const samplesTab = screen.getByRole('tab', { name: /sample queries/i} );
    await user.click(samplesTab);
    expect(screen.getByRole('searchbox')).toBeDefined();
    expect(screen.getByText(/You are viewing a cached set of samples/i)).toBeDefined();
    expect(screen.getByText(/See more queries in/i)).toBeDefined();
  })

  it('should test the resources tab', async () => {
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

  it('should test Request headers tab', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const requestHeadersTab = screen.getByRole('tab', { name: /request headers/i});
    await user.click(requestHeadersTab);
    screen.getByPlaceholderText(/key/i);
    screen.getByPlaceholderText(/value/i);
    screen.getByRole('button', { name: /add/i});
    screen.getByRole('columnheader', { name: /key/i});
    screen.getByRole('columnheader', { name: /value/i});
    screen.getByRole('columnheader', { name: /actions/i});
  });

  it('should test the Modify Permissions tab', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const modifyPermissionsTab = screen.getByRole('tab', { name: /modify permissions \(preview\)/i});
    await user.click(modifyPermissionsTab);
    expect(screen.getByText(/Permissions for the query are missing on this tab/i)).toBeDefined();
  });

  it('should test expanding response area', async () => {
    const user = userEvent.setup();
    renderApp({mobileScreen: false, showSidebar: true});
    const modifyPermissionsTab = screen.getByRole('tab', { name: /expand response/i});
    await user.click(modifyPermissionsTab);
    expect(screen.getByText(/response area expanded/i)).toBeDefined();
    screen.logTestingPlaygroundURL();
  });
})