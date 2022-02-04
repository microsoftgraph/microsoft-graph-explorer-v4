import { appTitleDisplayOnMobileScreen, appTitleDisplayOnFullScreen } from '../../app/views/app-sections/AppTitle';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

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

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('It should render the app title section in mobile screen size', () => {
  it('Renders app title section', () => {
    const { getByText } = renderTitle();
    getByText('Graph Explorer');
  });

  it('Renders app title section in full screen without crashing', () => {
    const { getByText } = renderTitleOnFullScreen({minimised: false});
    getByText('Graph Explorer');
  });

  it('Renders app title section in minimised mode without crashing', () => {
    renderTitleOnFullScreen({minimised: true});
    expect(screen.getByRole('heading'))
  })
})

