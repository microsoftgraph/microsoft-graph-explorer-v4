import { IResourceLink, ResourceLinkType } from '../../../../types/resources';
import { existsInCollection } from './resourcelink.utils';

const collectionPaths: IResourceLink[] = [
  {
    key: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-get-v1.0',
    url: '/agreementAcceptances/{agreementAcceptance-id}',
    name: '{agreementAcceptance-id}',
    labels: [],
    isExpanded: false,
    parent: '{agreementAcceptance-id}',
    level: 3,
    paths: [
      '/',
      'agreementAcceptances',
      '{agreementAcceptance-id}'
    ],
    method: 'GET',
    type: ResourceLinkType.PATH,
    links: [],
    docLink: '',
    version: 'v1.0'
  },
  {
    key: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-patch-v1.0',
    url: '/agreementAcceptances/{agreementAcceptance-id}',
    name: '{agreementAcceptance-id}',
    labels: [],
    isExpanded: false,
    parent: '{agreementAcceptance-id}',
    level: 3,
    paths: [
      '/',
      'agreementAcceptances',
      '{agreementAcceptance-id}'
    ],
    method: 'PATCH',
    type: ResourceLinkType.PATH,
    links: [],
    docLink: '',
    version: 'v1.0'
  }
]
describe('Resource link should', () => {
  it('find if parameter node exists in collection', async () => {
    const link = {
      key: '2-agreementAcceptances-{agreementAcceptance-id}',
      url: '2-agreementAcceptances-{agreementAcceptance-id}',
      name: '{agreementAcceptance-id} (3)',
      labels: [
        {
          name: 'beta',
          methods: [
            'GET',
            'PATCH',
            'DELETE'
          ]
        },
        {
          name: 'v1.0',
          methods: [
            'GET',
            'PATCH',
            'DELETE'
          ]
        }
      ],
      isExpanded: false,
      parent: 'agreementAcceptances',
      level: 2,
      paths: [
        '/',
        'agreementAcceptances'
      ],
      type: 'node',
      links: [
        {
          key: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-get',
          url: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-get',
          name: '{agreementAcceptance-id}',
          labels: [],
          isExpanded: false,
          parent: '{agreementAcceptance-id}',
          level: 3,
          paths: [
            '/',
            'agreementAcceptances',
            '{agreementAcceptance-id}'
          ],
          method: 'GET',
          type: 'path',
          links: [],
          docLink: ''
        },
        {
          key: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-patch',
          url: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-patch',
          name: '{agreementAcceptance-id}',
          labels: [],
          isExpanded: false,
          parent: '{agreementAcceptance-id}',
          level: 3,
          paths: [
            '/',
            'agreementAcceptances',
            '{agreementAcceptance-id}'
          ],
          method: 'PATCH',
          type: 'path',
          links: [],
          docLink: ''
        }
      ],
      docLink: ''
    } as IResourceLink;
    const version = 'v1.0';

    expect(existsInCollection(link, collectionPaths, version)).toBeTruthy();
    expect(existsInCollection(
      {
        key: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-delete',
        url: '3-{agreementAcceptance-id}-{agreementAcceptance-id}-delete',
        name: '{agreementAcceptance-id}',
        labels: [],
        isExpanded: false,
        parent: '{agreementAcceptance-id}',
        level: 3,
        paths: [
          '/',
          'agreementAcceptances',
          '{agreementAcceptance-id}'
        ],
        method: 'DELETE',
        type: ResourceLinkType.PATH,
        links: [],
        docLink: ''
      }, collectionPaths, 'beta')).toBeFalsy();
  });
});