import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import QueryParameters from '../../../app/views/sidebar/resource-explorer/panels/QueryParameters';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';

afterEach(cleanup);
const renderQueryParameters = () => {
  const resourceLink = {
    key: '5-{serviceHealth-id}-issues',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues',
    name: 'issues (1)',
    labels: [
      { name: 'v1.0', methods: ['Get', 'Post'] },
      { name: 'beta', methods: ['Get', 'Post'] }
    ],
    isExpanded: true,
    parent: '{serviceHealth-id}',
    level: 5,
    paths: ['/', 'admin', 'serviceAnnouncement', 'healthOverviews', '{serviceHealth-id}'],
    type: 'path',
    links: []
  }
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <QueryParameters version={'v1.0'} context={resourceLink}/>
    </IntlProvider>
  )
};

jest.mock('../../../app/views/sidebar/resource-explorer/resource-explorer.utils', () => {
  return {
    getUrlFromLink: jest.fn(() => {
      return 'https://graph.microsoft.com/v1.0/me';
    })
  }
})
jest.mock('react-redux', () => {
  return {
    useSelector: jest.fn(() => {
      return({
        autoComplete: {
          data: {
            url: 'https://graph.microsoft.com/v1.0/me/',
            parameters: [],
            createdAt: 'now'
          },
          error: null,
          pending: false
        }
      })
    }),
    useDispatch: jest.fn()
  }
});

jest.mock('react', () => {
  const React_ = jest.requireActual('react');
  return {
    ...React_,
    useEffect: jest.fn()
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests QueryParameters rendering in resources', ()=> {
  it('Renders query parameters without crashing', () => {
    const { getByText } = renderQueryParameters();
    getByText(/Query parameters/)
  });
});