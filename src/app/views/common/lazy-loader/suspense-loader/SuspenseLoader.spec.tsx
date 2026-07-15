jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SuspenseLoader } from './SuspenseLoader';

describe('SuspenseLoader', () => {
  it('renders children when no suspense', () => {
    render(
      <SuspenseLoader>
        <div data-testid="child">Hello</div>
      </SuspenseLoader>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <SuspenseLoader>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </SuspenseLoader>
    );
    expect(screen.getByTestId('a')).toBeInTheDocument();
    expect(screen.getByTestId('b')).toBeInTheDocument();
  });

  it('wraps children with ErrorBoundary and Suspense', () => {
    const { container } = render(
      <SuspenseLoader>
        <div>Content</div>
      </SuspenseLoader>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(container.firstChild).toBeTruthy();
  });
});
