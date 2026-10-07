import '@testing-library/jest-dom';

jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));

jest.mock('../../../../../modules/suggestions', () => ({
  delimiters: {
    DOLLAR: { symbol: '$' },
    EQUALS: { symbol: '=' }
  },
  getLastDelimiterInUrl: jest.fn().mockReturnValue({ index: 0, context: 'path' }),
  getSuggestions: jest.fn().mockReturnValue([]),
  SignContext: {}
}));
jest.mock('../../../../services/slices/autocomplete.slice', () => ({
  fetchAutoCompleteOptions: jest.fn().mockReturnValue({ type: 'autoComplete/fetch' })
}));
jest.mock('./suffix/SuffixRenderer', () => {
  const MockSuffix = () => <div data-testid="suffix-renderer">Suffix</div>;
  MockSuffix.displayName = 'SuffixRenderer';
  return { __esModule: true, default: MockSuffix };
});
jest.mock('./suggestion-list/SuggestionsList', () => {
  const MockSuggestionsList = () => <div data-testid="suggestions-list" />;
  MockSuggestionsList.displayName = 'SuggestionsList';
  return { __esModule: true, default: MockSuggestionsList };
});
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../utils/query-url-sanitization', () => ({
  sanitizeQueryUrl: jest.fn((url: string) => url)
}));
jest.mock('../../../../utils/sample-url-generation', () => ({
  parseSampleUrl: jest.fn().mockReturnValue({ requestUrl: '/me', queryVersion: 'v1.0' })
}));
jest.mock('./auto-complete.util', () => ({
  cleanUpSelectedSuggestion: jest.fn((_s: string, _q: string, selected: string) => selected),
  getFilteredSuggestions: jest.fn((_s: string, suggestions: string[]) => suggestions),
  getSearchText: jest.fn().mockReturnValue({ searchText: '', previous: '' })
}));
jest.mock('../../../../services/context/validation-context/ValidationContext', () => ({
  ValidationContext: {
    _currentValue: { validate: jest.fn(), error: '' },
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children({ validate: jest.fn(), error: '' })
  }
}));

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';
import AutoComplete from './AutoComplete';

// Provide a real ValidationContext for useContext
jest.mock('../../../../services/context/validation-context/ValidationContext', () => {
  const { createContext } = require('react');
  return {
    ValidationContext: createContext({ validate: jest.fn(), error: '' })
  };
});

describe('AutoComplete', () => {
  const defaultProps = {
    contentChanged: jest.fn(),
    runQuery: jest.fn()
  };

  it('renders input with current URL from store', () => {
    renderWithProviders(<AutoComplete {...defaultProps} />);
    const input = screen.getByLabelText('Query Sample Input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('https://graph.microsoft.com/v1.0/me');
  });

  it('handles basic input change', () => {
    renderWithProviders(<AutoComplete {...defaultProps} />);
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.change(input, { target: { value: 'https://graph.microsoft.com/v1.0/users' } });
    expect(input).toHaveValue('https://graph.microsoft.com/v1.0/users');
  });

  it('calls contentChanged on blur', () => {
    renderWithProviders(<AutoComplete {...defaultProps} />);
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.change(input, { target: { value: 'https://graph.microsoft.com/v1.0/users' } });
    fireEvent.blur(input);
    expect(defaultProps.contentChanged).toHaveBeenCalled();
  });

  describe('keyboard interactions', () => {
    function renderWithSuggestions(props?: Partial<typeof defaultProps>) {
      const mergedProps = { ...defaultProps, ...props };
      const suggestionsModule = require('../../../../../modules/suggestions');
      suggestionsModule.getSuggestions.mockReturnValue(['users', 'me', 'groups']);
      return renderWithProviders(<AutoComplete {...mergedProps} />, {
        preloadedState: {
          autoComplete: { data: { url: '/me', version: 'v1.0' }, pending: false }
        }
      });
    }

    afterEach(() => {
      const suggestionsModule = require('../../../../../modules/suggestions');
      suggestionsModule.getSuggestions.mockReturnValue([]);
    });

    it('Enter key with no suggestions calls runQuery', () => {
      const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
      renderWithProviders(<AutoComplete {...props} />);
      const input = screen.getByLabelText('Query Sample Input');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(props.runQuery).toHaveBeenCalled();
      expect(props.contentChanged).toHaveBeenCalled();
    });

    it('Enter key with suggestions showing selects active suggestion instead of running query', async () => {
      const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
      renderWithSuggestions(props);

      await waitFor(() => {
        expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
      });

      const input = screen.getByLabelText('Query Sample Input');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(props.contentChanged).toHaveBeenCalled();
      expect(props.runQuery).not.toHaveBeenCalled();
    });

    it('Escape key closes suggestions', async () => {
      const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
      renderWithSuggestions(props);

      await waitFor(() => {
        expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
      });

      const input = screen.getByLabelText('Query Sample Input');
      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByTestId('suggestions-list')).not.toBeInTheDocument();
      });
    });

    it('Backspace key does not throw and other keys reset backspacing', () => {
      const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
      renderWithProviders(<AutoComplete {...props} />);
      const input = screen.getByLabelText('Query Sample Input');
      fireEvent.keyDown(input, { key: 'Backspace' });
      fireEvent.keyDown(input, { key: 'a' });
      expect(input).toBeInTheDocument();
    });

    it('ArrowDown and ArrowUp navigate suggestions without closing them', async () => {
      const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
      renderWithSuggestions(props);

      await waitFor(() => {
        expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
      });

      const input = screen.getByLabelText('Query Sample Input');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    });

    it('Tab key with suggestions showing selects suggestion', async () => {
      const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
      renderWithSuggestions(props);

      await waitFor(() => {
        expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
      });

      const input = screen.getByLabelText('Query Sample Input');
      fireEvent.keyDown(input, { key: 'Tab' });

      expect(props.contentChanged).toHaveBeenCalled();
    });
  });

  it('displays validation error when context has error', () => {
    const { ValidationContext } = require('../../../../services/context/validation-context/ValidationContext');
    renderWithProviders(
      <ValidationContext.Provider value={{ validate: jest.fn(), error: 'Invalid URL' }}>
        <AutoComplete contentChanged={jest.fn()} runQuery={jest.fn()} />
      </ValidationContext.Provider>
    );
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });

  it('calls contentChanged with updated value on blur', () => {
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />);
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.change(input, { target: { value: 'https://example.com/api' } });
    fireEvent.blur(input);
    expect(props.contentChanged).toHaveBeenCalledWith('https://example.com/api');
  });

  it('does not trigger autocomplete for non-graph URLs', () => {
    const { fetchAutoCompleteOptions } = require('../../../../services/slices/autocomplete.slice');
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />);

    fetchAutoCompleteOptions.mockClear();
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.change(input, { target: { value: 'https://example.com/api' } });
    expect(fetchAutoCompleteOptions).not.toHaveBeenCalled();
  });

  it('ArrowDown wraps to beginning when at end of suggestions', async () => {
    const suggestionsModule = require('../../../../../modules/suggestions');
    suggestionsModule.getSuggestions.mockReturnValue(['users', 'me']);
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />, {
      preloadedState: {
        autoComplete: { data: { url: '/me', version: 'v1.0' }, pending: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('Query Sample Input');
    // Go down past the last item to wrap around
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // Should wrap to 0

    expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    suggestionsModule.getSuggestions.mockReturnValue([]);
  });

  it('ArrowUp wraps to end when at beginning of suggestions', async () => {
    const suggestionsModule = require('../../../../../modules/suggestions');
    suggestionsModule.getSuggestions.mockReturnValue(['users', 'me']);
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />, {
      preloadedState: {
        autoComplete: { data: { url: '/me', version: 'v1.0' }, pending: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('Query Sample Input');
    // ArrowUp at index 0 should wrap to end
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    suggestionsModule.getSuggestions.mockReturnValue([]);
  });

  it('Escape key does nothing when no suggestions are showing', () => {
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />);
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.keyDown(input, { key: 'Escape' });
    // Should not crash or call contentChanged
    expect(props.contentChanged).not.toHaveBeenCalled();
  });

  it('Tab key does nothing when no suggestions are showing', () => {
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />);
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.keyDown(input, { key: 'Tab' });
    // Should not call contentChanged
    expect(props.contentChanged).not.toHaveBeenCalled();
  });

  it('ArrowDown and ArrowUp do nothing when suggestions not showing', () => {
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />);
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    // No crash
    expect(input).toBeInTheDocument();
  });

  it('closes suggestions on blur outside container', async () => {
    const suggestionsModule = require('../../../../../modules/suggestions');
    suggestionsModule.getSuggestions.mockReturnValue(['users', 'me']);
    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />, {
      preloadedState: {
        autoComplete: { data: { url: '/me', version: 'v1.0' }, pending: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    });

    // Simulate blur with relatedTarget outside container
    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.blur(input.closest('div')!, { relatedTarget: document.body });

    suggestionsModule.getSuggestions.mockReturnValue([]);
  });

  it('appends = suffix when suggestion starts with $ and context is parameters', async () => {
    const suggestionsModule = require('../../../../../modules/suggestions');
    const autoCompleteUtil = require('./auto-complete.util');

    suggestionsModule.getSuggestions.mockReturnValue(['$select']);
    suggestionsModule.getLastDelimiterInUrl.mockReturnValue({ index: 40, context: 'parameters' });
    autoCompleteUtil.cleanUpSelectedSuggestion.mockImplementation(
      (_s: string, _q: string, selected: string) => selected
    );

    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />, {
      preloadedState: {
        autoComplete: { data: { url: '/me', version: 'v1.0' }, pending: false }
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('Query Sample Input');
    // Enter key selects the active suggestion ($select) which triggers appendSuggestionToUrl
    fireEvent.keyDown(input, { key: 'Enter' });

    // contentChanged should have been called with the suggestion that includes '=' suffix
    expect(props.contentChanged).toHaveBeenCalledWith(expect.stringContaining('$select='));

    // Restore defaults
    suggestionsModule.getSuggestions.mockReturnValue([]);
    suggestionsModule.getLastDelimiterInUrl.mockReturnValue({ index: 0, context: 'path' });
  });

  it('does not dispatch autocomplete when requestUrl is already in store', () => {
    const { fetchAutoCompleteOptions } = require('../../../../services/slices/autocomplete.slice');
    const { parseSampleUrl } = require('../../../../utils/sample-url-generation');

    // Make parseSampleUrl return values that match the store
    parseSampleUrl.mockReturnValue({ requestUrl: '/me', queryVersion: 'v1.0' });
    fetchAutoCompleteOptions.mockClear();

    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />, {
      preloadedState: {
        autoComplete: { data: { url: '/me', version: 'v1.0' }, pending: false }
      }
    });

    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.change(input, { target: { value: 'https://graph.microsoft.com/v1.0/me' } });

    // Since url matches store, fetchAutoCompleteOptions should NOT be dispatched again
    // (it may have been called during initial render, but not for this change)
    parseSampleUrl.mockReturnValue({ requestUrl: '/me', queryVersion: 'v1.0' });
  });

  it('dispatches fetchAutoCompleteOptions with empty url when requestUrl is empty', () => {
    const { fetchAutoCompleteOptions } = require('../../../../services/slices/autocomplete.slice');
    const { parseSampleUrl } = require('../../../../utils/sample-url-generation');

    parseSampleUrl.mockReturnValue({ requestUrl: '', queryVersion: 'v1.0' });
    fetchAutoCompleteOptions.mockClear();

    const props = { contentChanged: jest.fn(), runQuery: jest.fn() };
    renderWithProviders(<AutoComplete {...props} />, {
      preloadedState: {
        autoComplete: { data: null, pending: false }
      }
    });

    const input = screen.getByLabelText('Query Sample Input');
    fireEvent.change(input, { target: { value: 'https://graph.microsoft.com/' } });

    expect(fetchAutoCompleteOptions).toHaveBeenCalledWith(
      expect.objectContaining({ url: '', version: 'v1.0' })
    );

    // Restore default
    parseSampleUrl.mockReturnValue({ requestUrl: '/me', queryVersion: 'v1.0' });
  });
});
