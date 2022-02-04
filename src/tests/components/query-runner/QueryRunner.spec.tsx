import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { QueryRunner } from '../../../app/views/query-runner/QueryRunner';
import { IQueryInputProps, IQueryRunnerProps, IQueryRunnerState } from '../../../types/query-runner';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';
import QueryInput from '../../../app/views/query-runner/query-input/QueryInput';
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
        }
      })
    })
  }
})

const handleOnRunQuery = jest.fn();
const handleOnMethodChange = jest.fn();
const handleOnVersionChange = jest.fn();

const  sampleQuery =  {
  selectedVerb: 'GET',
  selectedVersion: 'v1',
  sampleUrl: 'https://graph.microsoft.com/v1.0/me',
  sampleHeaders: []
}

const queryInputProps : IQueryInputProps = {
  sampleQuery,
  handleOnRunQuery,
  handleOnMethodChange,
  handleOnVersionChange,
  handleOnUrlChange: jest.fn(),
  handleOnBlur: jest.fn(),
  submitting: false,
  authenticated: false,
  mode: Mode.Complete,
  intl: {
    message: messages
  }
}
// jest.mock('../../../app/views/query-runner/query-input/QueryInput.tsx', () => {
//   return {
//     __esModule: true,
//     // eslint-disable-next-line react/display-name
//     default: () =>  <QueryInput {...queryInputProps}/>
//   }
// })

jest.mock('../../../app/views/query-runner/request/Request.tsx', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: () => {
      return <div>Request</div>;
    }
  }
})

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
    // const { getByText } = renderQueryRunner();
    screen.debug();
    getByText(/Request/);
  })
})