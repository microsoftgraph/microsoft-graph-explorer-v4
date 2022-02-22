import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { Auth } from './Auth';

afterEach(cleanup);
const renderAuthSection = () => {
  return render(
    <Auth />
  )
}

jest.mock('react-redux', () => {
  return {
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

// eslint-disable-next-line no-console
console.error = jest.fn();

jest.mock('../../../common/dimensions/dimensions-adjustment.ts', () => {
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
    act(() => {
      expect(renderAuthSection()).toBeDefined();
      expect(screen.getByRole('alert')).toBeDefined();
    })
  })
})