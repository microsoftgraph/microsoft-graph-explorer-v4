import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { RequestHeaders } from '.';
import { geLocale } from '../../../../../appLocale';
import messages from '../../../../../messages';

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
  return {
    useSelector: jest.fn(() => {
      return {
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []

        },
        dimensions: {
          request: {
            height: 1000,
            width: 1000
          },
          response: {
            height: 1000,
            width: 1000
          }
        }
      }
    }),
    useDispatch: jest.fn()
  }
})

jest.mock('../../../common/dimensions/dimensions-adjustment.ts', () => {
  return {
    convertVhToPx: jest.fn(() => {
      return 1000
    }),
    getResponseHeight: jest.fn(() => {
      return 1000
    })
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests RequestHeaders component', () => {
  it('Renders the RequestHeaders component without crashing', () => {
    renderRequestHeaders();
    screen.getByPlaceholderText(/key/i);
    screen.getByPlaceholderText(/value/i);
    screen.getByRole('button', { name: /add/i});
    screen.getByRole('columnheader', { name: /key/i});
    screen.getByRole('columnheader', { name: /value/i});
    screen.getByRole('columnheader', { name: /actions/i});
    // screen.logTestingPlaygroundURL();
  })
})