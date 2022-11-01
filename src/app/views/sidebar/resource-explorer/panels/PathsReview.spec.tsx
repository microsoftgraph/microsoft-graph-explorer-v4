import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { geLocale } from '../../../../../appLocale';
import messages from '../../../../../messages';
import PathsReview from './PathsReview';
import { initializeIcons } from '@fluentui/react';

const renderPathsReview = () => {
  initializeIcons();
  return render(
    <IntlProvider locale={geLocale}
      messages={(messages as { [key: string]: object })[geLocale]}>
      <PathsReview isOpen={true} version={'v1.0'} toggleSelectedResourcesPreview={jest.fn()} />
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
      return ({
        resources: paths
      })
    }),
    useDispatch: jest.fn()
  }
})

describe('Paths review panel rendering', () => {
  it('should render the paths review panel of resource explorer with selected resources', () => {
    renderPathsReview();
    expect(screen.getByText(/Selected resources preview/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /close/i})).toBeDefined();
    expect(screen.getByText(/you can export the entire list as a postman collection/i));
    expect(screen.getByRole('button', { name: /download postman collection/i})).toBeDefined();
    expect(screen.getByRole('button', { name: /generate client - preview/i })).toBeDefined();
  });
})