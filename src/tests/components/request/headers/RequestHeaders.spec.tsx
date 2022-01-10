import React from 'react';
import { cleanup, render } from '@testing-library/react';
import RequestHeaders from '../../../../app/views/query-runner/request/headers/RequestHeaders';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../../appLocale';
import messages from '../../../../messages';

afterEach(cleanup);
const renderRequestHeaders = () => {
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <RequestHeaders />
    </IntlProvider>
  )
}

jest.mock('react-redux', () => {
  return{
    useSelector: jest.fn(() => {
      return{
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []

        },
        dimensions: {
          request: {
            height: 60,
            width: 60
          },
          response: {
            height: 60,
            width: 60
          }
        }
      }
    }),
    useDispatch: jest.fn()
  }
})

jest.mock('../../../../app/views/common/dimensions-adjustment.ts', () => {
  return {
    convertVhToPx: jest.fn(() => {
      return 60
    }),
    getResponseHeight: jest.fn(() => {
      return 60
    })
  }
})

describe('Tests RequestHeaders component', () => {
  it('Renders the RequestHeaders component without crashing', () => {
    renderRequestHeaders();
  })
})