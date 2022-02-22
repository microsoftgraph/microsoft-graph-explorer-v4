import React from 'react';
import { cleanup, render } from '@testing-library/react';
import SuggestionsList from '../../../app/views/query-runner/query-input/auto-complete/SuggestionsList';

afterEach(cleanup);
const renderSuggestionsList = (args?: any): any => {
  const defaultProps = {
    filteredSuggestions: [],
    activeSuggestion: 0,
    onClick: jest.fn()
  };
  const props = {...args, ...defaultProps};
  return render(<SuggestionsList {...props} />);
}

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests SuggestionsList component', () => {
  it('Renders suggestionslist without crashing', () => {
    renderSuggestionsList();
  })
})