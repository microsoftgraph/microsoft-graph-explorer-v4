import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Image } from '../../app/views/common/image/Image';

afterEach(cleanup);
const renderImage = () => {
  const body = new Blob([], { type: 'image/jpeg' });
  const alt = 'Sample Image';
  const styles = {};
  const props = { body, alt, styles };
  return render(<Image {...props} />);
}
// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests image rendering', () => {
  it('Renders image', () => {
    const { getByAltText } = renderImage();
    getByAltText('Sample Image');
  });
})