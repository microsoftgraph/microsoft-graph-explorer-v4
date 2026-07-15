import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Image } from './Image';

describe('Image component', () => {
  const mockArrayBuffer = new ArrayBuffer(8);

  const createMockBody = () => ({
    clone: () => ({
      arrayBuffer: () => Promise.resolve(mockArrayBuffer)
    })
  });

  beforeAll(() => {
    (global as any).URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');
  });

  afterAll(() => {
    delete (global as any).URL.createObjectURL;
  });

  it('renders img element with alt text', () => {
    render(<Image styles={{ width: 100 }} alt="profile photo" body={createMockBody() as any} />);
    expect(screen.getByAltText('profile photo')).toBeInTheDocument();
  });

  it('sets image src from blob URL after mount', async () => {
    render(<Image styles={{ width: 100 }} alt="test" body={createMockBody() as any} />);
    await waitFor(() => {
      expect(screen.getByAltText('test')).toHaveAttribute('src', 'blob:http://localhost/mock-url');
    });
  });

  it('renders with provided styles', () => {
    render(<Image styles={{ width: 200, height: 200 }} alt="styled" body={createMockBody() as any} />);
    const img = screen.getByAltText('styled');
    expect(img).toHaveStyle({ width: '200px', height: '200px' });
  });
});
