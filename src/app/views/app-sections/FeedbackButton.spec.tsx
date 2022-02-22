import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { FeedbackButton } from './FeedbackButton';

afterEach(cleanup);
const renderFeedbackButton = () => {
  return render(
    <FeedbackButton />
  )
}

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => {
    return {
      profile: {
        profileType: 'MSA'
      }
    }
  }),
  useDispatch: jest.fn()
}));

// eslint-disable-next-line no-console
console.warn = jest.fn();

// eslint-disable-next-line react/display-name
jest.mock('../../app/views/query-runner/request/feedback/FeedbackForm.tsx', () => () => {
  return <div>Feedback</div>
})

describe('Tests Feedback button', () => {
  it('Renders feedback button without crashing', () => {
    const { getByText } = renderFeedbackButton();
    expect(getByText(/Help Improve Graph Explorer/)).toBeDefined();

  });
})