import React from 'react';
import { cleanup, render } from '@testing-library/react';
import ResponseHeaders from './ResponseHeaders';

afterEach(cleanup);
const renderResponseHeaders = (): any => {
  return render(
    <ResponseHeaders />
  )
}

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => {
    return ({
      dimensions: {
        request: {
          height: 60,
          width: 60
        },
        response: {
          height: 60,
          width: 60
        }
      },
      graphResponse: {
        body: {},
        headers: {
          'Content-Type': 'application/json',
          'cache-control': 'public'
        }
      },
      responseAreaExpanded: false,
      sampleQuery: {
        selectedVerb: 'GET',
        selectedVersion: 'v1',
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        sampleHeaders: []
      }
    })
  })
}))


// eslint-disable-next-line no-console
console.warn = jest.fn()

jest.mock('../../common/dimensions/dimensions-adjustment.ts', () => {
  return {
    convertVhToPx: jest.fn(() => {
      return 60
    }),
    getResponseHeight: jest.fn(() => {
      return 60
    })
  }
})

describe('Tests Response Headers', () => {
  it('Renders response headers', () => {
    renderResponseHeaders();
  })
})