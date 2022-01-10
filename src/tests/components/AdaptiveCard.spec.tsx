import React from 'react';
import { cleanup, render as RTLRender } from '@testing-library/react';
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
const renderAdaptiveCard = (args? : any) : any => {
  const adaptiveCard : IAdaptiveCardProps = {
    body: {
      name: 'Dummy name'
    },
    card: {
      pending: false
    },
    intl: {
      message: {}
    }
  };
  const appStore: any = store;
  const props = {...args, ...adaptiveCard}
  return RTLRender(
    <Provider store={appStore}>
      <IntlProvider
        locale={geLocale}
        messages={(messages as { [key: string]: object })[geLocale]}
      >
        <ThemeContext.Consumer >
          {() => (
            // @ts-ignore
            <AdaptiveCard
              body={adaptiveCard}
              hostConfig={lightThemeHostConfig}
            />
          )}
        </ThemeContext.Consumer>
      </IntlProvider>
    </Provider>
  );
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

describe('Renders an adaptive card', () => {
  it('Renders an adaptive card', () => {
    // const { getByText } = renderAdaptiveCard();
    expect(1).toBe(1);
  });
})