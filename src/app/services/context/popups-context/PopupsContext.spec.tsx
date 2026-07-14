import React from 'react';
import { render, screen } from '@testing-library/react';
import { PopupsProvider, usePopupsStateContext, usePopupsDispatchContext } from './PopupsContext';

const TestConsumer = () => {
  const state = usePopupsStateContext();
  const dispatch = usePopupsDispatchContext();
  return (
    <div>
      <span data-testid="popups-count">{state.popups.length}</span>
      <span data-testid="has-dispatch">{typeof dispatch === 'function' ? 'yes' : 'no'}</span>
    </div>
  );
};

describe('PopupsContext', () => {
  it('renders children within PopupsProvider', () => {
    render(
      <PopupsProvider>
        <div data-testid="child">Hello</div>
      </PopupsProvider>
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('provides initial state with empty popups array', () => {
    render(
      <PopupsProvider>
        <TestConsumer />
      </PopupsProvider>
    );
    expect(screen.getByTestId('popups-count').textContent).toBe('0');
  });

  it('provides dispatch function', () => {
    render(
      <PopupsProvider>
        <TestConsumer />
      </PopupsProvider>
    );
    expect(screen.getByTestId('has-dispatch').textContent).toBe('yes');
  });
});
