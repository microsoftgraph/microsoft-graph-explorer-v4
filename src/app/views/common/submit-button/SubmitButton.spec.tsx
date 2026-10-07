import React from 'react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';

import SubmitButton from './SubmitButton';

describe('SubmitButton', () => {
  const mockHandleOnClick = jest.fn();

  const defaultProps = {
    handleOnClick: mockHandleOnClick,
    submitting: false,
    text: 'Run Query',
    ariaLabel: 'Run query button',
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with text', () => {
    render(<SubmitButton {...defaultProps} />);
    expect(screen.getByText('Run Query')).toBeInTheDocument();
  });

  it('renders button with aria-label', () => {
    render(<SubmitButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Run query button' })).toBeInTheDocument();
  });

  it('calls handleOnClick when button is clicked', () => {
    render(<SubmitButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandleOnClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when submitting is true', () => {
    render(<SubmitButton {...defaultProps} submitting={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables button when disabled prop is true', () => {
    render(<SubmitButton {...defaultProps} disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled when both submitting and disabled are false', () => {
    render(<SubmitButton {...defaultProps} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('does not call handleOnClick when button is disabled', () => {
    render(<SubmitButton {...defaultProps} disabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandleOnClick).not.toHaveBeenCalled();
  });

  it('shows spinner with visible class when submitting', () => {
    const { container } = render(<SubmitButton {...defaultProps} submitting={true} />);
    const spinner = container.querySelector('[role="progressbar"]');
    expect(spinner).toBeInTheDocument();
  });
});
