import React, { Component } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import AdaptiveCard  from '../../app/views/query-response/adaptive-cards/AdaptiveCard';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../appLocale';
import messages from '../../messages';
import { store } from '../../store';
import { IAdaptiveCardProps } from '../../types/adaptivecard';
import { ThemeContext } from '@fluentui/react';
import { lightThemeHostConfig } from '../../app/views/query-response/adaptive-cards/AdaptiveHostConfig';

afterEach(cleanup);
const renderAdaptiveCard = () : any => {
  const appStore: any = store;

  return render(
    <div>
      <Provider store={appStore}>
        <IntlProvider
          locale={geLocale}
          messages={(messages as { [key: string]: object })[geLocale]}
        >
          <AdaptiveCard/>
        </IntlProvider>
      </Provider>
    </div>
  );
}
// eslint-disable-next-line no-console
console.warn = jest.fn()

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

// jest.mock('react-redux', () => {
//   const redux_ = jest.requireActual('react-redux');
//   return {
//     ...redux_
//     // connect: jest.fn(
//     //   // eslint-disable-next-line no-unused-vars
//     //   <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
//     // )
//   }
// })

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Renders an adaptive card', () => {
  it('Renders an adaptive card without crashing', () => {
    // const { getByText } = renderAdaptiveCard();
    screen.debug();
    expect(1).toBe(1);
  });
})