import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { CopyButton } from '../../app/views/common/copy/CopyButton';

afterEach(cleanup);
const renderCopyButton = (args?: any): any => {
  const copyProps = {
    handleOnClick:jest.fn(),
    isIconButton: true
  }

  return render(
    <CopyButton {...copyProps} {...args} />
  );
}

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests copy button component', () => {
  it('Renders copy button without crashing', () => {
    renderCopyButton();
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('Copied'));
  })
})