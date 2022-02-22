import React from 'react';
import { cleanup, render } from '@testing-library/react';

import CommandOptions from './CommandOptions';

afterEach(cleanup);
const renderCommandOptions = () => {
  return render(
    <CommandOptions version={'v1.0'} />
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
      return ({
        resources: paths
      })
    }),
    useDispatch: jest.fn()
  }
})

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests CommandOptions', () => {
  it('Renders command options', () => {
    const { getByText } = renderCommandOptions();
  })
})