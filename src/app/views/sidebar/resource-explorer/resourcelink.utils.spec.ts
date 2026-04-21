import { IResourceLink, ResourceLinkType } from '../../../../types/resources';
import { existsInCollection, setExisting, handleShiftArrowSelection } from './resourcelink.utils';

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

describe('setExisting', () => {
  it('sets isInCollection to true', () => {
    const item = { isInCollection: false } as IResourceLink;
    setExisting(item, true);
    expect(item.isInCollection).toBe(true);
  });

  it('sets isInCollection to false', () => {
    const item = { isInCollection: true } as IResourceLink;
    setExisting(item, false);
    expect(item.isInCollection).toBe(false);
  });
});

describe('handleShiftArrowSelection', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];

  it('returns original selection when focusedIndex is null', () => {
    const result = handleShiftArrowSelection({
      direction: 'down',
      focusedIndex: null,
      anchorIndex: null,
      items,
      currentSelection: new Set(['a'])
    });
    expect(result.newSelection).toEqual(new Set(['a']));
  });

  it('selects range when moving down', () => {
    const result = handleShiftArrowSelection({
      direction: 'down',
      focusedIndex: 1,
      anchorIndex: 1,
      items,
      currentSelection: new Set(['b'])
    });
    expect(result.newFocusedIndex).toBe(2);
    expect(result.newAnchorIndex).toBe(1);
    expect(result.newSelection).toEqual(new Set(['b', 'c']));
  });

  it('selects range when moving up', () => {
    const result = handleShiftArrowSelection({
      direction: 'up',
      focusedIndex: 2,
      anchorIndex: 2,
      items,
      currentSelection: new Set(['c'])
    });
    expect(result.newFocusedIndex).toBe(1);
    expect(result.newSelection).toEqual(new Set(['b', 'c']));
  });

  it('does not go below zero', () => {
    const result = handleShiftArrowSelection({
      direction: 'up',
      focusedIndex: 0,
      anchorIndex: 0,
      items,
      currentSelection: new Set(['a'])
    });
    expect(result.newFocusedIndex).toBe(0);
  });

  it('does not go beyond items length', () => {
    const result = handleShiftArrowSelection({
      direction: 'down',
      focusedIndex: 4,
      anchorIndex: 4,
      items,
      currentSelection: new Set(['e'])
    });
    expect(result.newFocusedIndex).toBe(4);
  });

  it('supports targetIndex', () => {
    const result = handleShiftArrowSelection({
      focusedIndex: 0,
      anchorIndex: 0,
      items,
      currentSelection: new Set(),
      targetIndex: 3
    });
    expect(result.newFocusedIndex).toBe(3);
    expect(result.newSelection).toEqual(new Set(['a', 'b', 'c', 'd']));
  });
});