import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Auth } from '../../../app/views/query-runner/request/auth/Auth';

afterEach(cleanup);
const renderAuthSection = () => {
  return render(
    <Auth />
  )
}

jest.mock('react-redux', () => {
  return{
    useSelector: jest.fn(() => {
      return {
        authToken: 'JDJDJSKJDKS',
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
    })
  }
})


jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}))

// eslint-disable-next-line no-console
console.warn = jest.fn()

jest.mock('../../../app/views/common/dimensions-adjustment.ts', () => {
  return {
    convertVhToPx: jest.fn(() => {
      return 60
    }),
    getResponseHeight: jest.fn(() => {
      return 60
    })
  }
})

describe('Tests Auth component', () => {
  it('Renders the Auth component without crashing', () => {
    renderAuthSection();
  })
})