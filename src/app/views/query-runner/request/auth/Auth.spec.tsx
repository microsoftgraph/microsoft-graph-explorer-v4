jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    getToken: jest.fn().mockResolvedValue({ accessToken: 'mock-access-token-value' })
  }
}));
jest.mock('../../../../../telemetry', () => ({
  telemetry: { trackReactComponent: jest.fn((c: any) => c) },
  componentNames: { ACCESS_TOKEN_TAB: 'AccessToken', ACCESS_TOKEN_COPY_BUTTON: 'CopyBtn' }
}));
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../services/graph-constants', () => ({
  ACCOUNT_TYPE: { MSA: 'MSA', AAD: 'AAD' }
}));
jest.mock('../../../common/copy', () => ({
  trackedGenericCopy: jest.fn()
}));
jest.mock('../../../common/lazy-loader/component-registry', () => ({
  CopyButton: ({ handleOnClick }: any) => <button onClick={handleOnClick}>Copy</button>
}));
jest.mock('../../../../../store', () => ({
  useAppSelector: jest.fn()
}));
jest.mock('@fluentui/react-components', () => ({
  makeStyles: () => () => ({}),
  tokens: { spacingHorizontalS: '4px' },
  Text: ({ children }: any) => <span>{children}</span>,
  Button: (props: any) => <a href={props.href} aria-disabled={props.disabled}>{props.children}</a>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  MessageBar: ({ children, intent }: any) => <div data-intent={intent}>{children}</div>
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Auth } from './Auth';
import { useAppSelector } from '../../../../../store';

describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in message when not authenticated', () => {
    (useAppSelector as unknown as jest.Mock)
      .mockImplementation((fn: any) => {
        const state = {
          profile: { user: null },
          auth: { authToken: { token: false, pending: false } }
        };
        return fn(state);
      });
    render(<Auth />);
    expect(screen.getByText('Sign In to see your access token.')).toBeDefined();
  });

  it('shows loading initially when authenticated', () => {
    (useAppSelector as unknown as jest.Mock)
      .mockImplementation((fn: any) => {
        const state = {
          profile: { user: { profileType: 'AAD' } },
          auth: { authToken: { token: true, pending: false } }
        };
        return fn(state);
      });
    render(<Auth />);
    expect(screen.getByText(/Getting your access token/)).toBeDefined();
  });

  it('renders access token after loading', async () => {
    const state = {
      profile: { user: { profileType: 'Guest' } },
      auth: { authToken: { token: true, pending: false } }
    };
    (useAppSelector as unknown as jest.Mock)
      .mockImplementation((fn: any) => fn(state));
    render(<Auth />);
    expect(await screen.findByText('Access Token')).toBeDefined();
  });
});
