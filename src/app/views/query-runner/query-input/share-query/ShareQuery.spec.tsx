import React from 'react';
import { ShareQuery } from './ShareQuery';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


afterEach(cleanup);
const renderShareQuery = () => {
  return render (<ShareQuery />);
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
        }
      }
    })
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn();

describe('Tests the share button', () => {
  it('Tests the share button rendering', () =>{
    const { getByText } = renderShareQuery();
    userEvent.click(screen.getByRole('button'));
    expect(getByText(/Share this link to let people try your/)).toBeDefined();
    expect(getByText(/Share Query/)).toBeDefined();
    expect(getByText(/Copy/)).toBeDefined();
    expect(getByText(/developer.microsoft.com/)).toBeDefined();
  })
})
