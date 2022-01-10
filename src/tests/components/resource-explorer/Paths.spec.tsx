import React from 'react';
import { cleanup, render } from '@testing-library/react';
import Paths from '../../../app/views/sidebar/resource-explorer/panels/Paths';

afterEach(cleanup);
const renderPaths = () => {
  const columns = [
    { key: 'url', name: 'Url', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true }
  ];

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
  return render(
    <Paths resources={paths} columns={columns} selectItems={jest.fn()}/>
  )
}


describe('Tests resource paths rendering', () => {
  it('Renders resource paths', () => {
    const { getByText } = renderPaths();
  })
})