import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { resources } from '../../../app/services/reducers/resources-reducer';
import {
  FETCH_RESOURCES_ERROR, FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_SUCCESS
} from '../../../app/services/redux-constants';
import { IResource, IResourceLink, IResources, ResourceLinkType } from '../../../types/resources';

const res = {
  'segment': '/',
  'labels': [
    {
      'name': 'v1.0',
      'methods': [
        'Get'
      ]
    },
    {
      'name': 'beta',
      'methods': [
        'Get'
      ]
    }
  ],
  'children': [
    {
      'segment': 'accessReviewDecisions',
      'labels': [
        {
          'name': 'beta',
          'methods': [
            'Get',
            'Post'
          ]
        }
      ],
      'children': [
        {
          'segment': '{accessReviewDecision-id}',
          'labels': [
            {
              'name': 'beta',
              'methods': [
                'Get',
                'Patch',
                'Delete'
              ]
            }
          ]
        }
      ]
    }
  ]
};

const resource = JSON.parse(JSON.stringify(res)) as IResource
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState: IResources = {
  pending: false,
  data: {
    children: [],
    labels: [],
    segment: ''
  },
  error: null
};

const paths = [{
  key: '5-issues',
  url: '/issues',
  name: 'issues (1)',
  labels: [
    {
      name: 'v1.0', methods: [{
        name: 'Get',
        documentationUrl: null
      }, {
        name: 'Post',
        documentationUrl: null
      }]
    },
    {
      name: 'beta', methods: [{
        name: 'Get',
        documentationUrl: null
      }, {
        name: 'Post',
        documentationUrl: null
      }]
    }
  ],
  version: 'v1.0',
  methods: [{
    name: 'Get',
    documentationUrl: null
  }, {
    name: 'Post',
    documentationUrl: null
  }],
  isExpanded: true,
  parent: '/',
  level: 1,
  paths: ['/'],
  type: 'path',
  links: []
}];

const resourceLinks: IResourceLink[] = [
  {
    labels: [
      {
        name: 'v1.0', methods: [{
          name: 'Get',
          documentationUrl: null
        }, {
          name: 'Post',
          documentationUrl: null
        }]
      }
    ],
    key: '5-issues',
    url: '/issues',
    name: 'issues (1)',
    icon: 'LightningBolt',
    isExpanded: true,
    level: 7,
    parent: '/',
    paths: ['/'],
    type: ResourceLinkType.PATH,
    links: []
  }
];

describe('Resources Reducer', () => {
  it('should return initial state', () => {
    const dummyAction = { type: 'Dummy', response: { dummy: 'Dummy' } };
    const newState = resources(initialState, dummyAction);
    expect(newState).toEqual(initialState);
  });

  it('should handle FETCH_RESOURCES_SUCCESS', () => {
    const newState = { ...initialState };
    newState.data = resource;

    const resourceAction = { type: FETCH_RESOURCES_SUCCESS, response: resource };
    const state = resources(initialState, resourceAction);

    expect(state).toEqual(newState);
  });

  it.skip('should handle FETCH_RESOURCES_ERROR', () => {

    const mockResponse = new Error('400');

    const newState = { ...initialState };
    newState.error = mockResponse;
    newState.data = resource;

    const resourceAction = { type: FETCH_RESOURCES_ERROR, response: mockResponse };
    const state = resources(initialState, resourceAction);

    expect(state).toEqual(newState);
  });

  it('should handle FETCH_RESOURCES_PENDING', () => {
    const isRunning = true;
    const newState = { ...initialState };
    newState.pending = isRunning;
    const queryAction = { type: FETCH_RESOURCES_PENDING, response: null };
    const state = resources(initialState, queryAction);
    expect(state).toEqual(newState);
  });

});
