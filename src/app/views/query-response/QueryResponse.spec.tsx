import React from 'react';
import { cleanup, render } from '@testing-library/react';
import QueryResponse from '../../../app/views/query-response/QueryResponse';
import { IQueryResponseProps } from '../../../types/query-response';
import { Mode } from '../../../types/enums';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';
import { messages_ } from '../../utils/get-messages';

afterEach(cleanup);
const renderQueryResponse = () => {
  const message = messages_['en-US'] as object;
  const queryResponseProps: IQueryResponseProps = {
    mode: Mode.Complete,
    dispatch: jest.fn(),
    graphResponse: {
      body: {},
      headers: []
    },
    intl: {
      message
    },
    verb: 'GET',
    theme: 'dark',
    scopes: [],
    sampleQuery: {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: []
    },
    actions: {
      getConsent: jest.fn()
    },
    mobileScreen: false
  }

  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <QueryResponse {...queryResponseProps} />
    </IntlProvider>)
}

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}))

jest.mock('react-redux', () => {
  return {
    useDispatch: () => jest.fn(),
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    ),
    useSelector: jest.fn(() => {
      return ({
        dimensions: {
          request: {
            height: '60',
            width: '60'
          },
          response: {
            height: '60',
            width: '60'
          }
        },
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1.0',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        },
        graphExplorerMode: Mode.Complete,
        graphResponse: {
          body: {}
        }
      })
    })
  };
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Renders QuerResponse', () => {
  it('Renders QuerResponse without crashing', () => {
    renderQueryResponse();
  })
})