import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../query-response/snippets/Snippets', () => () => <div>Snippets</div>);
jest.mock('../../../query-runner/request/permissions', () => () => <div>Permissions</div>);
jest.mock('../../../app-sections/StatusMessages', () => () => <div>StatusMessages</div>);
jest.mock('../../../query-response/headers/ResponseHeaders', () => () => <div>Headers</div>);
jest.mock('../../../query-response/graph-toolkit/GraphToolkit', () => () => <div>GraphToolkit</div>);
jest.mock('../../copy-button/CopyButton', () => () => <div>CopyButton</div>);
jest.mock('../../../query-runner/request/auth/Auth', () => () => <div>Auth</div>);
jest.mock('../../../query-runner/request/headers/RequestHeaders', () => () => <div>RequestHeaders</div>);
jest.mock('../../../sidebar/history/History', () => () => <div>History</div>);
jest.mock('../../../sidebar/resource-explorer/ResourceExplorer', () => () => <div>ResourceExplorer</div>);

import {
  Permissions,
  StatusMessages,
  Snippets,
  CopyButton,
  Auth,
  RequestHeaders,
  History,
  ResourceExplorer,
  ResponseHeaders,
  GraphToolkit
} from './index';

describe('Component Registry', () => {
  it('renders Permissions', () => {
    render(<Permissions />);
    expect(screen.getByText('Permissions')).toBeInTheDocument();
  });

  it('renders StatusMessages', () => {
    render(<StatusMessages />);
    expect(screen.getByText('StatusMessages')).toBeInTheDocument();
  });

  it('renders Snippets', () => {
    render(<Snippets />);
    expect(screen.getByText('Snippets')).toBeInTheDocument();
  });

  it('renders CopyButton', () => {
    render(<CopyButton />);
    expect(screen.getByText('CopyButton')).toBeInTheDocument();
  });

  it('renders Auth', () => {
    render(<Auth />);
    expect(screen.getByText('Auth')).toBeInTheDocument();
  });

  it('renders RequestHeaders', () => {
    render(<RequestHeaders />);
    expect(screen.getByText('RequestHeaders')).toBeInTheDocument();
  });

  it('renders History', () => {
    render(<History />);
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('renders ResourceExplorer', () => {
    render(<ResourceExplorer />);
    expect(screen.getByText('ResourceExplorer')).toBeInTheDocument();
  });

  it('renders ResponseHeaders', () => {
    render(<ResponseHeaders />);
    expect(screen.getByText('Headers')).toBeInTheDocument();
  });

  it('renders GraphToolkit', () => {
    render(<GraphToolkit />);
    expect(screen.getByText('GraphToolkit')).toBeInTheDocument();
  });
});
