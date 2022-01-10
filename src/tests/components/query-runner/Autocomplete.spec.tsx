import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import AutoComplete from '../../../app/views/query-runner/query-input/auto-complete/AutoComplete';
import { IAutoCompleteProps, IAutoCompleteState } from '../../../types/auto-complete';

afterEach(cleanup);
const renderAutoComplete = (args?: any): any => {
  const autoCompleteProps: IAutoCompleteProps = {
    suggestions: ['sugggestion 1', 'sugggestion 2', 'sugggestion 3'],
    contentChanged: jest.fn(),
    runQuery: jest.fn(),
    sampleQuery: {
      selectedVerb: 'GET',
      selectedVersion: 'v1',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      sampleHeaders: []
    },
    fetchingSuggestions: false,
    autoCompleteError: null,
    autoCompleteOptions: {
      url: 'https://graph.microsoft.com/v1.0/me',
      parameters: []
    },
    actions: {
      fetchAutoCompleteOptions: jest.fn()
    }
  }

  const autocompleteState :  IAutoCompleteState = {
    activeSuggestion: 0,
    filteredSuggestions: [],
    suggestions: ['sugggestion 1', 'sugggestion 2', 'sugggestion 3'],
    showSuggestions: true,
    userInput: '/m',
    compare: '',
    queryUrl: 'https://graph.microsoft.com/v1.0/me',
    multiline: false
  }

  const allProps = {...autoCompleteProps, ...autocompleteState , ...args};
  return render(
    <AutoComplete {...allProps} />
  );
}

jest.mock('react-redux', () => {
  return{
    useDispatch: jest.fn(),
    connect: jest.fn(
      // eslint-disable-next-line no-unused-vars
      <P extends object>(_props?: any) => (component: React.ComponentType<P>) => component
    ),
    useSelector: jest.fn(() => {
      return({
        autoComplete: {
          data: {
            url: 'https://graph.microsoft.com/v1.0/me',
            parameters: [
              {
                verb: 'GET',
                values: [
                  {
                    name: '$select',
                    items: []
                  }
                ],
                links: ['link1', 'link2']
              }
            ],
            createdAt: '364763737373'
          }
        },
        sampleQuery: {
          selectedVerb: 'GET',
          selectedVersion: 'v1',
          sampleUrl: 'https://graph.microsoft.com/v1.0/me',
          sampleHeaders: []
        },
        queryRunnerStatus: {
          mwssageType: 0,
          ok: true,
          status: 200,
          duration: 300
        },
        samples: {
          queries: [],
          pending: false,
          error: null
        }
      })
    })
  }
})

describe('Tests AutoComplete render', () => {
  it('Renders autocomplete suggestions without crashing', () => {
    renderAutoComplete();
    screen.getByRole('textbox');
  })
})