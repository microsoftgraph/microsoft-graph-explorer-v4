import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ResourceExplorer } from '../../../app/views/sidebar/resource-explorer';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../appLocale';
import messages from '../../../messages';

afterEach(cleanup);
const renderResourceExplorer = () => {
  return render(
    <IntlProvider
      locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}
    >
      <ResourceExplorer />
    </IntlProvider>
  )
}

const paths = [
  {
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
  }, {
    key: '6-issues-{serviceHealthIssue-id}',
    url: '/admin/serviceAnnouncement/healthOverviews/{serviceHealth-id}/issues/{serviceHealthIssue-id}',
    name: '{serviceHealthIssue-id} (1)',
    labels: [
      { name: 'v1.0', methods: ['Get', 'Patch', 'Delete'] },
      { name: 'beta', methods: ['Get', 'Patch', 'Delete'] }
    ],
    isExpanded: true,
    parent: 'issues',
    level: 6,
    paths: ['/', 'admin', 'serviceAnnouncement', 'healthOverviews', '{serviceHealth-id}', 'issues'],
    type: 'path',
    links: []
  }
];

jest.mock('react-redux', () => {
  return {
    useSelector: jest.fn(() => {
      return {
        resources: {
          pending: false,
          error: null,
          paths,
          data: {
            segment: '/',
            labels: [
              { name: 'v1.0', methods: ['Get', 'Post'] },
              {name: 'beta', methods: ['Get', 'Post']}
            ],
            children: [
              {
                segment: 'accessReviewDecisions',
                labels: [
                  { name: 'v1.0', methods: ['Get', 'Post'] }
                ]
              }
            ]
          }
        }
      }
    }),
    useDispatch: jest.fn()
  }
})

describe('Tests Resource Explorer', () => {
  it('Renders the resource explorer', () => {
    const { getByTestId } = renderResourceExplorer();
  })
})