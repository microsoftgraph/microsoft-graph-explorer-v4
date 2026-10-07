import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../../test-utils';
import ResponseHeaders from './ResponseHeaders';

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { logIn: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn() }
}));
jest.mock('../../common', () => ({
  Monaco: (props: any) => <div data-testid="monaco">{JSON.stringify(props.body)}</div>
}));
jest.mock('../../common/copy', () => ({
  trackedGenericCopy: jest.fn()
}));
jest.mock('../../common/lazy-loader/component-registry', () => ({
  CopyButton: (props: any) => (
    <button data-testid="copy-btn" onClick={props.handleOnClick}>Copy</button>
  )
}));

describe('ResponseHeaders component', () => {
  it('renders empty div when headers are undefined', () => {
    const { container } = renderWithProviders(<ResponseHeaders />);
    expect(screen.queryByTestId('monaco')).toBeNull();
    expect(screen.queryByTestId('copy-btn')).toBeNull();
    expect(container.firstChild).toBeTruthy();
    expect(container.firstChild!.nodeName).toBe('DIV');
  });

  it('renders Monaco and CopyButton when headers exist', () => {
    const headers = { 'content-type': 'application/json' };
    renderWithProviders(<ResponseHeaders />, {
      preloadedState: {
        graphResponse: {
          isLoadingData: false,
          response: {
            body: undefined,
            headers
          }
        }
      }
    });
    expect(screen.getByTestId('monaco')).toBeTruthy();
    expect(screen.getByTestId('copy-btn')).toBeTruthy();
    expect(screen.getByTestId('monaco').textContent).toBe(JSON.stringify(headers));
  });
});
