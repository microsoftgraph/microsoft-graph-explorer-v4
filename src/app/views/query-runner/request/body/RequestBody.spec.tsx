import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../../../test-utils';
import RequestBody from './RequestBody';

jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: { logIn: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn() }
}));
jest.mock('../../../common', () => ({
  Monaco: (props: any) => (
    <div data-testid="monaco" data-visible={props.isVisible}>
      {JSON.stringify(props.body)}
    </div>
  )
}));

describe('RequestBody component', () => {
  it('renders Monaco editor with sample body from store', () => {
    const sampleBody = '{ "displayName": "Test" }';
    renderWithProviders(
      <RequestBody handleOnEditorChange={jest.fn()} isVisible={true} />,
      {
        preloadedState: {
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          }
        }
      }
    );
    expect(screen.getByTestId('monaco')).toBeTruthy();
    expect(screen.getByTestId('monaco').textContent).toBe(JSON.stringify(sampleBody));
  });

  it('passes isVisible prop through', () => {
    renderWithProviders(
      <RequestBody handleOnEditorChange={jest.fn()} isVisible={false} />,
      {
        preloadedState: {
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          }
        }
      }
    );
    expect(screen.getByTestId('monaco').getAttribute('data-visible')).toBe('false');
  });
});
