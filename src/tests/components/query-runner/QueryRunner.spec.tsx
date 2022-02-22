import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { QueryRunner } from '../../../app/views/query-runner/QueryRunner';
import { IQueryRunnerProps, IQueryRunnerState } from '../../../types/query-runner';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';
import { Mode } from '../../../types/enums';
afterEach(cleanup);
const renderQueryRunner = (args?: any): any => {
  const queryRunnerProps: IQueryRunnerProps = {
    headers: [],
    onSelectVerb: jest.fn(),
    sampleQuery: {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: []
    },
    actions: {
      runQuery: jest.fn(),
      addRequestHeader: jest.fn(),
      setSampleQuery: jest.fn(),
      setQueryResponseStatus: jest.fn()
    }
  }

  const queryRunnerState: IQueryRunnerState = {
    url: 'https://graph.microsoft.com/v1.0/me'
  }

  const allProps = {...queryRunnerState, ...queryRunnerProps, ...args};
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <QueryRunner {...allProps} />
    </IntlProvider>
  );
}

jest.mock('react-redux', () => {
  return{
    useDispatch: jest.fn(),
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    ),
    useSelector: jest.fn( () => {
      return({
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        },
        authToken: {
          pending: false,
          token: true
        },
        isLoadingData: false,
        submitting: false,
        authenticated: false,
        mode: Mode.Complete,
        intl: {
          message: messages
        },
        dimensions: {
          request: {
            width: 10,
            height: 10
          },
          response: {
            width: 10,
            height: 10
          }
        }
      })
    })
  }
})

// eslint-disable-next-line react/display-name
jest.mock('../../../app/views/query-runner/query-input/QueryInput.tsx');

jest.mock('../../../app/views/query-runner/request/Request.tsx');

// eslint-disable-next-line no-console
console.warn = jest.fn()

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

describe('Tests QueryRunner', () => {
  it('Renders query runner without crashing', () => {
    expect(renderQueryRunner()).toBeDefined();
  })
})