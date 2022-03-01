import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { geLocale } from '../../../../appLocale';
import messages from '../../../../messages';
import { messages_ } from '../../../../tests/utils/get-messages';
import { Mode } from '../../../../types/enums';
import { IQueryInputProps } from '../../../../types/query-runner';
import IntlQueryInput from './QueryInput';

afterEach(cleanup);
const renderQueryInput = (args?: any): any => {
  const queryInputProps: IQueryInputProps = {
    handleOnRunQuery: jest.fn(),
    handleOnMethodChange: jest.fn(),
    handleOnUrlChange: jest.fn(),
    handleOnVersionChange: jest.fn(),
    handleOnBlur: jest.fn(),
    sampleQuery: {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: []
    },
    submitting: false,
    authenticated: true,
    mode: Mode.Complete,
    intl: {
      message: messages_
    },
    actions: {
      setSampleQuery: jest.fn()
    }
  }

  const allProps = { ...queryInputProps, ...args };
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <IntlQueryInput {...allProps} />
    </IntlProvider>
  );
}

jest.mock('../query-input/auto-complete/AutoComplete.tsx')

// eslint-disable-next-line no-console
console.warn = jest.fn();

jest.mock('react-redux', () => {
  return {
    useDispatch: jest.fn(),
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    ),
    useSelector: jest.fn(() => {
      return ({
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1.0',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        },
        authToken: {
          pending: false,
          token: true
        },
        isLoadingData: false,
        autoComplete: {
          data: {},
          error: null,
          pending: false
        },
        samples: {
          pending: false,
          error: null,
          queries: [
            {
              category: 'Sample category',
              requestUrl: '/me',
              method: 'GET',
              humanName: 'Sample name',
              docLink: 'https://graph.microsoft.com/v1.0/me'
            }
          ]
        },
        queryRunnerStatus: {
          messageType: 1,
          ok: true,
          status: 200,
          statusText:''
        },
        sidebarProperties: {
          showSidebar: false,
          mobileScreen: false
        }
      })
    })
  }
})

describe('Renders QueryInput component without crashing', () => {
  it('renders without crashing', () => {
    const { getByText } = renderQueryInput()
    getByText(/Run query/);
    expect(renderQueryInput()).toBeDefined();
  });
})