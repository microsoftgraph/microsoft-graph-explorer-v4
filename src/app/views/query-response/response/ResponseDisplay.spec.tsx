import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../common', () => ({
  Monaco: (props: any) => (
    <div data-testid="monaco" data-language={props.language}>{String(props.body).substring(0, 50)}</div>
  ),
  Image: (props: any) => <div data-testid="image">{props.alt}</div>
}));
jest.mock('../../../services/actions/query-action-creator-util', () => ({
  isImageResponse: (contentType: string) => contentType?.startsWith('image/')
}));
jest.mock('../../common/monaco/util/format-xml', () => ({
  formatXml: (xml: string) => xml
}));

import ResponseDisplay from './ResponseDisplay';

describe('ResponseDisplay component', () => {
  it('renders Monaco for application/json', () => {
    render(<ResponseDisplay contentType="application/json" body='{"name":"test"}' />);
    const monaco = screen.getByTestId('monaco');
    expect(monaco).toBeInTheDocument();
    expect(monaco).toHaveAttribute('data-language', 'application/json');
  });

  it('renders Monaco for text/html', () => {
    render(<ResponseDisplay contentType="text/html" body='<html><body>Hello</body></html>' />);
    const monaco = screen.getByTestId('monaco');
    expect(monaco).toBeInTheDocument();
    expect(monaco).toHaveAttribute('data-language', 'text/html');
  });

  it('renders Monaco for application/xml', () => {
    render(<ResponseDisplay contentType="application/xml" body='<root><item>value</item></root>' />);
    const monaco = screen.getByTestId('monaco');
    expect(monaco).toBeInTheDocument();
    expect(monaco).toHaveAttribute('data-language', 'text/html');
  });

  it('renders image for image content types with non-string body', () => {
    const blobBody = new Blob(['image data']);
    render(<ResponseDisplay contentType="image/png" body={blobBody} />);
    const image = screen.getByTestId('image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveTextContent('profile image');
  });

  it('renders Monaco for unknown types with string body', () => {
    render(<ResponseDisplay contentType="text/plain" body="Some plain text" />);
    const monaco = screen.getByTestId('monaco');
    expect(monaco).toBeInTheDocument();
    expect(monaco).toHaveAttribute('data-language', 'text/plain');
  });
});
