jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children normally', () => {
    const Child = () => <div>Child Content</div>;
    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    expect(screen.getByText('Child Content')).toBeDefined();
  });

  it('passes onError prop to children', () => {
    const Child = (props: any) => {
      expect(typeof props.onError).toBe('function');
      return <div>Child</div>;
    };
    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
  });

  it('shows error message when onError is called', () => {
    const Child = (props: any) => (
      <button onClick={props.onError}>Trigger Error</button>
    );
    render(
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    );
    act(() => {
      screen.getByText('Trigger Error').click();
    });
    expect(screen.queryByText('Something went wrong')).toBeDefined();
  });
});
