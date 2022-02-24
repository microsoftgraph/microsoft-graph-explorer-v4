import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import { appTitleDisplayOnMobileScreen, appTitleDisplayOnFullScreen } from './AppTitle';

afterEach(cleanup)
const renderTitle = () => {
  const stackTokens = {
    childrenGap: 10,
    padding: 10
  }
  const classes_ = jest.fn();
  return render(
    <div>
      {appTitleDisplayOnMobileScreen(stackTokens, classes_, jest.fn())}
    </div>
  )
}

const renderTitleOnFullScreen = (args?: any) => {
  const classes_ = jest.fn();
  const mimimised = args?.minimised ? args?.minimised : false;

  return render(
    <div>
      {appTitleDisplayOnFullScreen(classes_, mimimised, jest.fn())}
    </div>
  )
}

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

// eslint-disable-next-line react/display-name
jest.mock('../query-runner/request/feedback/FeedbackForm.tsx', () => () => {
  return <div>Feedback</div>
});

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
console.warn = jest.fn()

describe('It should render the app title section in mobile screen size', () => {
  it('Renders app title section', () => {
    const { getByText } = renderTitle();
    getByText('Graph Explorer');
  });

  it('Renders app title section in full screen without crashing', () => {
    const { getByText } = renderTitleOnFullScreen({ minimised: false });
    getByText('Graph Explorer');
  });

  it('Renders app title section in minimised mode without crashing', () => {
    renderTitleOnFullScreen({ minimised: true });
    expect(screen.getByRole('heading')).toBeDefined();
  })
})

