import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Request } from '../../../../app/views/query-runner/request/Request';
import { Mode } from '../../../../types/enums';
import {messages_} from '../../../utils/get-messages'
import { IRequestComponent } from '../../../../types/request';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../../appLocale';
import { store } from '../../../../store';
import messages from '../../../../messages';

afterEach(cleanup);
const renderRequest = (args?: any): any => {
  const messages = (messages_ as { [key: string]: object })[geLocale];

  const requestProps : IRequestComponent = {
    sampleQuery: {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: []
    },
    mode: Mode.Complete,
    handleOnEditorChange: jest.fn(),
    dimensions: {
      request: {
        width: '60',
        height: '60'
      },
      response: {
        width: '60',
        height: '60'
      }
    },
    intl: {
      messages
    },
    actions: {
      setDimensions: jest.fn()
    },
    officeBrowserFeedback: {},
    enableShowSurvey: true
  }
  const appStore: any = store;
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <Request {...requestProps} />
    </IntlProvider>

  )
}
{/* <Request {...requestProps} /> */}
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

jest.mock('react-redux', () => {
  return{
    useSelector: jest.fn(() => {
      return({
        dimensions: {
          request: {
            width: '60',
            height: '60'
          },
          response: {
            width: '60',
            height: '60'
          }
        },
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        }
      })
    }),
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    ),
    useDispatch: jest.fn()
  }
})

describe('Tests Request component', () => {
  it('Renders Request section without crashing', () => {
    const { getByText } =renderRequest();
    screen.debug();
    getByText(/Request body/);
    getByText(/Request headers/);
    getByText(/Got feedback/)
  })
})