jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommonCollectionsPanel from './CommonCollectionsPanel';

describe('CommonCollectionsPanel', () => {
  const defaultProps = {
    primaryButtonText: 'Download',
    primaryButtonAction: jest.fn(),
    primaryButtonDisabled: false,
    closePopup: jest.fn(),
    children: <div data-testid="child-content">Children</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children content', () => {
    render(<CommonCollectionsPanel {...defaultProps} />);
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders primary button with translated text', () => {
    render(<CommonCollectionsPanel {...defaultProps} />);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<CommonCollectionsPanel {...defaultProps} />);
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls primaryButtonAction on primary button click', () => {
    render(<CommonCollectionsPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('Download'));
    expect(defaultProps.primaryButtonAction).toHaveBeenCalled();
  });

  it('calls closePopup on close button click', () => {
    render(<CommonCollectionsPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('Close'));
    expect(defaultProps.closePopup).toHaveBeenCalled();
  });

  it('disables primary button when primaryButtonDisabled is true', () => {
    render(<CommonCollectionsPanel {...defaultProps} primaryButtonDisabled={true} />);
    const btn = screen.getByText('Download');
    expect(btn.closest('button')).toBeDisabled();
  });

  it('renders message bar when messageBarText is provided', () => {
    render(<CommonCollectionsPanel {...defaultProps} messageBarText="Info message" />);
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('renders message bar with span text when both messageBarText and messageBarSpanText provided', () => {
    render(
      <CommonCollectionsPanel {...defaultProps} messageBarText="Info" messageBarSpanText="bold text" />
    );
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
  });

  it('does not render message bar when messageBarText is not provided', () => {
    render(<CommonCollectionsPanel {...defaultProps} />);
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  it('does not render span when messageBarSpanText is not provided but messageBarText is', () => {
    const { container } = render(
      <CommonCollectionsPanel {...defaultProps} messageBarText="Info only" />
    );
    expect(screen.getByText('Info only')).toBeInTheDocument();
    const bolds = container.querySelectorAll('span[style*="font-weight: bold"]');
    expect(bolds.length).toBe(0);
  });
});
