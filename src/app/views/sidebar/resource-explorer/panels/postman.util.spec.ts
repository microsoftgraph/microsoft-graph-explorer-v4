import { IResource } from '../../../../../types/resources';
import { createResourcesList, getResourcePaths } from '../resource-explorer.utils';
import { generatePostmanCollection } from './postman.util';

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
  'children': [{
    'segment': 'appCatalogs',
    'labels': [
      {
        'name': 'v1.0',
        'methods': [
          'Get',
          'Patch'
        ]
      },
      {
        'name': 'beta',
        'methods': [
          'Get',
          'Patch'
        ]
      }
    ],
    'children': [
      {
        'segment': 'teamsApps',
        'labels': [
          {
            'name': 'v1.0',
            'methods': [
              'Get',
              'Post'
            ]
          },
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
            'segment': '{teamsApp-id}',
            'labels': [
              {
                'name': 'v1.0',
                'methods': [
                  'Get',
                  'Patch',
                  'Delete'
                ]
              },
              {
                'name': 'beta',
                'methods': [
                  'Get',
                  'Patch',
                  'Delete'
                ]
              }
            ],
            'children': [
              {
                'segment': 'appDefinitions',
                'labels': [
                  {
                    'name': 'v1.0',
                    'methods': [
                      'Get',
                      'Post'
                    ]
                  },
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
                    'segment': '{teamsAppDefinition-id}',
                    'labels': [
                      {
                        'name': 'v1.0',
                        'methods': [
                          'Get',
                          'Patch',
                          'Delete'
                        ]
                      },
                      {
                        'name': 'beta',
                        'methods': [
                          'Get',
                          'Patch',
                          'Delete'
                        ]
                      }
                    ],
                    'children': [
                      {
                        'segment': 'bot',
                        'labels': [
                          {
                            'name': 'v1.0',
                            'methods': [
                              'Get',
                              'Patch',
                              'Delete'
                            ]
                          },
                          {
                            'name': 'beta',
                            'methods': [
                              'Get',
                              'Patch',
                              'Delete'
                            ]
                          }
                        ]
                      },
                      {
                        'segment': 'colorIcon',
                        'labels': [
                          {
                            'name': 'beta',
                            'methods': [
                              'Get',
                              'Patch',
                              'Delete'
                            ]
                          }
                        ],
                        'children': [
                          {
                            'segment': 'hostedContent',
                            'labels': [
                              {
                                'name': 'beta',
                                'methods': [
                                  'Get',
                                  'Patch',
                                  'Delete'
                                ]
                              }
                            ],
                            'children': [
                              {
                                'segment': '$value',
                                'labels': [
                                  {
                                    'name': 'beta',
                                    'methods': [
                                      'Get',
                                      'Put'
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        'segment': 'outlineIcon',
                        'labels': [
                          {
                            'name': 'beta',
                            'methods': [
                              'Get',
                              'Patch',
                              'Delete'
                            ]
                          }
                        ],
                        'children': [
                          {
                            'segment': 'hostedContent',
                            'labels': [
                              {
                                'name': 'beta',
                                'methods': [
                                  'Get',
                                  'Patch',
                                  'Delete'
                                ]
                              }
                            ],
                            'children': [
                              {
                                'segment': '$value',
                                'labels': [
                                  {
                                    'name': 'beta',
                                    'methods': [
                                      'Get',
                                      'Put'
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }]
};
const resource = JSON.parse(JSON.stringify(res)) as IResource

describe('Postman collection should', () => {
  it('have items generated', async () => {
    const version = 'v1.0';
    const filtered = createResourcesList(resource.children, version)[0];
    const item: any = filtered.links[0];
    const paths = getResourcePaths(item, version);
    const collection = generatePostmanCollection(paths);
    expect(collection.item.length).toBeGreaterThan(0);
  });
});
