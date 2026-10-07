import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SuggestionsList from './SuggestionsList';

jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...args: string[]) => args.filter(Boolean).join(' '),
  Option: ({ children, onClick, className, ...props }: any) => (
    <li role="option" onClick={onClick} className={className} {...props}>{children}</li>
  )
}));
jest.mock('./SuggestionsList.styles', () => ({
  useSuggestionStyles: () => ({
    suggestions: 'suggestions-class',
    suggestionActive: 'active-class',
    suggestionOption: 'option-class'
  })
}));

describe('SuggestionsList', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders a list of suggestions', () => {
    render(
      <SuggestionsList
        filteredSuggestions={['users', 'groups', 'messages']}
        activeSuggestion={0}
        onSuggestionSelected={mockOnSelect}
      />
    );
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('groups')).toBeInTheDocument();
    expect(screen.getByText('messages')).toBeInTheDocument();
  });

  it('renders empty list when no suggestions', () => {
    const { container } = render(
      <SuggestionsList
        filteredSuggestions={[]}
        activeSuggestion={0}
        onSuggestionSelected={mockOnSelect}
      />
    );
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list!.children.length).toBe(0);
  });

  it('applies active class to the active suggestion', () => {
    render(
      <SuggestionsList
        filteredSuggestions={['users', 'groups', 'messages']}
        activeSuggestion={1}
        onSuggestionSelected={mockOnSelect}
      />
    );
    const items = screen.getAllByRole('option');
    expect(items[1].className).toContain('active-class');
    expect(items[0].className).toContain('option-class');
    expect(items[2].className).toContain('option-class');
  });

  it('calls onSuggestionSelected when an item is clicked', () => {
    render(
      <SuggestionsList
        filteredSuggestions={['users', 'groups', 'messages']}
        activeSuggestion={0}
        onSuggestionSelected={mockOnSelect}
      />
    );
    fireEvent.click(screen.getByText('groups'));
    expect(mockOnSelect).toHaveBeenCalledWith('groups');
  });

  it('calls onSuggestionSelected with the correct suggestion value', () => {
    render(
      <SuggestionsList
        filteredSuggestions={['$select', '$filter', '$expand']}
        activeSuggestion={0}
        onSuggestionSelected={mockOnSelect}
      />
    );
    fireEvent.click(screen.getByText('$filter'));
    expect(mockOnSelect).toHaveBeenCalledWith('$filter');
  });

  it('sets aria-selected on the active suggestion', () => {
    render(
      <SuggestionsList
        filteredSuggestions={['users', 'groups']}
        activeSuggestion={0}
        onSuggestionSelected={mockOnSelect}
      />
    );
    const items = screen.getAllByRole('option');
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
    expect(items[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('renders ul with tabIndex -1', () => {
    const { container } = render(
      <SuggestionsList
        filteredSuggestions={['users']}
        activeSuggestion={0}
        onSuggestionSelected={mockOnSelect}
      />
    );
    const list = container.querySelector('ul');
    expect(list).toHaveAttribute('tabindex', '-1');
  });
});
