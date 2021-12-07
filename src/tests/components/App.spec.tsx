import React from 'react';
import { cleanup, render } from '@testing-library/react';
import App from '../../app/views/App';
import { Mode } from '../../types/enums';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { geLocale } from '../../appLocale';
import messages from '../../messages';

afterEach(cleanup)
const renderApp = (args?: any) : any => {
  const defaultProps = {
    profile: null,
    queryState: null,
    termsOfUse: true,
    graphExplorerMode: Mode.Complete,
    sidebarProperties: {mobileScreen: false, showSidebar: true},
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

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}))

jest.mock('@ms-ofb/officebrowserfeedbacknpm/scripts/app/Window/Window', () => ({
  OfficeBrowserFeedback: Object
}))

jest.mock('@ms-ofb/officebrowserfeedbacknpm/Floodgate', () => ({
  makeFloodgate: Object
}))

jest.mock('@ms-ofb/officebrowserfeedbacknpm/scripts/app/Configuration/IInitOptions', () => ({
  AuthenticationType: 0
}))

describe('It should mount the main app', () => {
  it('Should render the main app component', () => {
    const { getByText } = renderApp();
    getByText('Run query');
  })
})