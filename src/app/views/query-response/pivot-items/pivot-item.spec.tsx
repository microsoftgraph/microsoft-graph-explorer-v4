import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';

jest.mock('../response', () => ({ Response: () => <div data-testid="response">Response</div> }));
jest.mock('../../common/lazy-loader/component-registry', () => ({
  ResponseHeaders: () => <div data-testid="response-headers">Headers</div>,
  Snippets: () => <div data-testid="snippets">Snippets</div>
}));
jest.mock('../adaptive-cards/AdaptiveCard', () => ({
  __esModule: true,
  default: () => <div data-testid="adaptive-cards">AC</div>
}));
jest.mock('../adaptive-cards/AdaptiveHostConfig', () => ({
  darkThemeHostConfig: {},
  lightThemeHostConfig: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('@fluentui/react-components', () => {
  const actual = jest.requireActual('@fluentui/react-components');
  return {
    ...actual,
    Overflow: ({ children }: any) => <div>{children}</div>,
    OverflowItem: ({ children }: any) => <div>{children}</div>,
    useOverflowMenu: () => ({ ref: { current: null }, isOverflowing: false, overflowCount: 0 }),
    useIsOverflowItemVisible: () => true
  };
});

import { GetPivotItems } from './pivot-item';

describe('GetPivotItems', () => {
  it('renders Response Preview tab by default in TryIt mode', () => {
    renderWithProviders(<GetPivotItems />, {
      preloadedState: {
        graphExplorerMode: 'TryIt',
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        theme: 'light'
      }
    });

    expect(screen.getByRole('tab', { name: 'Response Preview' })).toBeTruthy();
    expect(screen.getByTestId('response')).toBeTruthy();
  });

  it('shows only 2 tabs (Response Preview, Response Headers) in TryIt mode', () => {
    renderWithProviders(<GetPivotItems />, {
      preloadedState: {
        graphExplorerMode: 'TryIt',
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        theme: 'light'
      }
    });

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'Response Preview' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Response Headers' })).toBeTruthy();
  });

  it('shows 4 tabs in Complete mode', () => {
    renderWithProviders(<GetPivotItems />, {
      preloadedState: {
        graphExplorerMode: 'COMPLETE',
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        theme: 'light'
      }
    });

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    expect(screen.getByRole('tab', { name: 'Response Preview' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Response Headers' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Snippets' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Adaptive Cards' })).toBeTruthy();
  });

  it('shows the code snippets in place of the response preview when the Snippets tab is selected', () => {
    renderWithProviders(<GetPivotItems />, {
      preloadedState: {
        graphExplorerMode: 'COMPLETE',
        graphResponse: { isLoadingData: false, response: { body: undefined, headers: undefined } },
        theme: 'light'
      }
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Snippets' }));

    expect(screen.getByRole('tab', { name: 'Snippets' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('snippets')).toBeTruthy();
    expect(screen.queryByTestId('response')).toBeNull();
  });
});
