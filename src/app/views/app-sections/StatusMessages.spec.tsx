import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import statusMessages from './StatusMessages';

afterEach(cleanup)
const renderStatusMessage = () => {
  return render(
    <div>
      {statusMessages()}
    </div>
  )
}

jest.mock('react-redux', () => {
  return ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(() => {
      return {
        queryRunnerStatus: {
          messageType: 1,
          ok: true,
          status: 200,
          statusText: 'OK',
          duration: 200
        },
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1.0',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        }
      }
    })
  })
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Renders the status bar', () => {
  it('Renders the status bar', () => {
    renderStatusMessage();
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByTitle('Close')).toBeDefined();
  })
})