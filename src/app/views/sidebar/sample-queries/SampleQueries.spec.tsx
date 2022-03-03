import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl';

import { geLocale } from '../../../../appLocale';
import { ISampleQueriesProps } from '../../../../types/query-runner';
import SampleQueries from './SampleQueries';
import { messages_ } from '../../../utils/get-messages';

afterEach(cleanup);
const renderSampleQueries = () => {
  const messages = (messages_ as { [key: string]: object })[geLocale];
  const sampleQueriesProps: ISampleQueriesProps = {
    tokenPresent: true,
    profile: {},
    samples: {
      pending: false,
      queries: [
        {
          category: 'Getting Started',
          method: 'GET',
          requestUrl: '/v1.0/me/',
          humanName: 'my profile',
          docLink: 'https://graph.microsoft.com/v1.0/me',
          skipTest: false
        },
        {
          category: 'Getting Started',
          method: 'GET',
          requestUrl: '/v1.0/me/photo',
          humanName: 'my photo',
          docLink: 'https://graph.microsoft.com/v1.0/me',
          skipTest: false
        }
      ],
      error: {
        message: ''
      }
    },
    intl: {
      message: messages
    }
  }

  jest.mock('../../query-runner/query-input/QueryInput.tsx')

  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <SampleQueries {...sampleQueriesProps} />
    </IntlProvider>
  )
}
jest.mock('react-redux', () => {
  return {
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    )
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests SampleQueries', () => {
  it('Renders SampleQueries without crashing', () => {
    renderSampleQueries();
    expect(screen.getByRole('searchbox')).toBeDefined();
    userEvent.type(screen.getByRole('searchbox'), 'my profile');
    expect(screen.getByText(/my profile/)).toBeDefined();
  })
})
