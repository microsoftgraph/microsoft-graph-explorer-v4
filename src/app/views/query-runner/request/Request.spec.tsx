import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { Request } from '../../../../app/views/query-runner/request/Request';
import { geLocale } from '../../../../appLocale';
import { messages_ } from '../../../../tests/utils/get-messages';
import { Mode } from '../../../../types/enums';
import { IRequestComponent } from '../../../../types/request';

afterEach(cleanup);
const renderRequest = (): any => {
  const messages = (messages_ as { [key: string]: object })[geLocale];

  const requestProps: IRequestComponent = {
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
        width: '60px',
        height: '60px'
      },
      response: {
        width: '60px',
        height: '60px'
      },
      sidebar: {
        width: '60px',
        height: '60px'
      },
      content: {
        width: '60px',
        height: '60px'
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
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <Request {...requestProps} />
    </IntlProvider>

  )
}

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

jest.mock('react-redux', () => {
  return {
    useSelector: jest.fn(() => {
      return ({
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
    const { getByText } = renderRequest();
    getByText(/Request body/);
    getByText(/Request headers/);
    getByText(/Modify permissions/);
    getByText(/Access token/);
  })
})