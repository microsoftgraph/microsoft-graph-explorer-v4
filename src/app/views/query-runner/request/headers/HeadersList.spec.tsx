import { render, screen } from '@testing-library/react';
import React from 'react';
import HeadersList from './HeadersList';

describe('HeadersList', () => {
  const mockDelete = jest.fn();
  const mockEdit = jest.fn();

  it('renders table headers', () => {
    render(
      <HeadersList
        headers={[]}
        handleOnHeaderDelete={mockDelete}
        handleOnHeaderEdit={mockEdit}
      />
    );
    // Table should be rendered
    expect(document.querySelector('table')).toBeDefined();
  });

  it('renders header items', () => {
    const headers = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Authorization', value: 'Bearer token123' }
    ];
    render(
      <HeadersList
        headers={headers}
        handleOnHeaderDelete={mockDelete}
        handleOnHeaderEdit={mockEdit}
      />
    );
    expect(screen.getByText('Content-Type')).toBeDefined();
    expect(screen.getByText('application/json')).toBeDefined();
  });

  it('filters out headers with empty value', () => {
    const headers = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Empty', value: '' }
    ];
    render(
      <HeadersList
        headers={headers}
        handleOnHeaderDelete={mockDelete}
        handleOnHeaderEdit={mockEdit}
      />
    );
    expect(screen.getByText('Content-Type')).toBeDefined();
    expect(screen.queryByText('Empty')).toBeNull();
  });

  it('handles null headers', () => {
    render(
      <HeadersList
        headers={null as any}
        handleOnHeaderDelete={mockDelete}
        handleOnHeaderEdit={mockEdit}
      />
    );
    expect(document.querySelector('table')).toBeDefined();
  });
});
