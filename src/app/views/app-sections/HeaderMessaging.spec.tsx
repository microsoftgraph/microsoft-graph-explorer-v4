import React from 'react';
import '@testing-library/jest-dom';
import { screen, cleanup, render } from '@testing-library/react';

jest.mock('../../../modules/authentication/authUtils', () => ({
  getLoginType: jest.fn()
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('@fluentui/react-components', () => ({
  makeStyles: () => () => ({ root: 'mock-root' }),
  Link: ({ children, href, inline, ...props }: any) => <a href={href} {...props}>{children}</a>,
  MessageBar: ({ children, intent }: any) => <div data-testid="message-bar">{children}</div>,
  MessageBarBody: ({ children }: any) => <span>{children}</span>
}));

import { headerMessaging } from './HeaderMessaging';
import { getLoginType } from '../../../modules/authentication/authUtils';

function TestComponent({ query }: { query: string }) {
  const result = headerMessaging(query);
  return <>{result}</>;
}

describe('headerMessaging', () => {
  const testQuery = 'https://developer.microsoft.com/graph/graph-explorer';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders popup login message when login type is POPUP', () => {
    (getLoginType as jest.Mock).mockReturnValue('POPUP');
    const { container } = render(<TestComponent query={testQuery} />);
    expect(container.innerHTML).toContain('To try the full features');
  });

  it('renders redirect login message when login type is REDIRECT', () => {
    (getLoginType as jest.Mock).mockReturnValue('REDIRECT');
    const { container } = render(<TestComponent query={testQuery} />);
    expect(container.innerHTML).toContain('To try operations other than GET');
  });

  it('renders nothing when login type is neither POPUP nor REDIRECT', () => {
    (getLoginType as jest.Mock).mockReturnValue(undefined);
    const { container } = render(<TestComponent query={testQuery} />);
    expect(container.innerHTML).not.toContain('To try the full features');
    expect(container.innerHTML).not.toContain('To try operations other than GET');
  });

  it('popup link href matches the query URL', () => {
    (getLoginType as jest.Mock).mockReturnValue('POPUP');
    const { container } = render(<TestComponent query={testQuery} />);
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe(testQuery);
  });

  it('redirect link href matches the query URL', () => {
    (getLoginType as jest.Mock).mockReturnValue('REDIRECT');
    const { container } = render(<TestComponent query={testQuery} />);
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe(testQuery);
  });
});
