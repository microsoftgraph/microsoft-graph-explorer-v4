import React from 'react';
import { cleanup, render } from '@testing-library/react';
import IntlQueryInput from '../../../app/views/query-runner/query-input/QueryInput';
import { IQueryInputProps } from '../../../types/query-runner';
import { Mode } from '../../../types/enums';
import { messages_ } from '../../utils/get-messages';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';

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

  const allProps = {...queryInputProps, ...args};
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <IntlQueryInput {...allProps} />
    </IntlProvider>
  );
}

jest.mock('../../../app/views/query-runner/query-input/auto-complete/AutoComplete.tsx')

// eslint-disable-next-line no-console
console.warn = jest.fn();

jest.mock('react-redux', () => {
  return{
    useDispatch: jest.fn(),
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    ),
    useSelector: jest.fn(() => {
      return({
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
        isLoadingData: false
      })
    })
  }
})

describe('Renders QueryInput component without crashing', () => {
  it('renders without crashing', () => {
    renderQueryInput();
  });
})