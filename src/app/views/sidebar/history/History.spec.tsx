import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { geLocale } from '../../../../appLocale';
import { messages_ } from '../../../../tests/utils/get-messages';
import { IHistoryProps } from '../../../../types/history';
import { History } from './History';

interface IExtendedHistory extends IHistoryProps {
  intl: object;
}
afterEach(cleanup);
const renderHistoryTab = (args?: any) => {
  const messages = messages_['en-US'];
  const historyProps: IExtendedHistory = {
    history: [
      {
        url: 'https://graph.microsoft.com/v1.0/me',
        method: 'GET',
        headers: [],
        body: '',
        createdAt: '484848',
        status: 200,
        duration: 200
      }
    ],
    intl: { messages }
  }
  const _messages = (messages_ as { [key: string]: object })[geLocale];

  const allProps = { ...args, ...historyProps };

  return render(
    <IntlProvider
      locale={geLocale}
      messages={(_messages as { [key: string]: object })[geLocale]}
    >
      <History {...allProps} />
    </IntlProvider>
  )
}

// eslint-disable-next-line no-console
console.warn = jest.fn();
console.error = jest.fn();

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  // eslint-disable-next-line react/display-name
  withAITracking: () => React.Component,
  ReactPlugin: Object
}))

describe('Tests History Tab', () => {
  it('Renders history tab without crashing', () => {
    renderHistoryTab();
    expect(screen.getByRole('searchbox')).toBeDefined();
    screen.getByText(/Older/);
  })
})