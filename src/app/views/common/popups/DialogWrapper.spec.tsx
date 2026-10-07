jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DialogWrapper } from './DialogWrapper';

describe('DialogWrapper', () => {
  const mockDismiss = jest.fn();
  const mockClose = jest.fn();
  const MockComponent = (props: any) => <div data-testid="mock-component">Dialog Content</div>;

  const defaultProps = {
    isOpen: true,
    dismissPopup: mockDismiss,
    closePopup: mockClose,
    Component: MockComponent,
    popupsProps: {
      settings: {
        title: 'Test Dialog'
      },
      data: {}
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dialog with title when open', () => {
    render(<DialogWrapper {...defaultProps} />);
    expect(screen.getByText('Test Dialog')).toBeDefined();
  });

  it('renders the component content', () => {
    render(<DialogWrapper {...defaultProps} />);
    expect(screen.getByTestId('mock-component')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, subtitle: 'A subtitle' }
      }
    };
    render(<DialogWrapper {...props} />);
    expect(screen.queryByText('A subtitle')).toBeDefined();
  });

  it('renders without title when not provided', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, title: '' }
      }
    };
    render(<DialogWrapper {...props} />);
    expect(screen.getByTestId('mock-component')).toBeDefined();
  });

  it('renders footer when renderFooter is provided', () => {
    const renderFooter = jest.fn().mockReturnValue(<button>Save</button>);
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, renderFooter }
      }
    };
    render(<DialogWrapper {...props} />);
    expect(renderFooter).toHaveBeenCalled();
    expect(screen.getByText('Save')).toBeDefined();
  });

  it('passes dismissPopup and closePopup to Component', () => {
    const MockComp = jest.fn((props: any) => {
      return (
        <div>
          <button data-testid="dismiss-btn" onClick={props.dismissPopup}>Dismiss</button>
          <button data-testid="close-btn" onClick={(e: any) => props.closePopup(e)}>Close</button>
        </div>
      );
    });
    const props = { ...defaultProps, Component: MockComp };
    render(<DialogWrapper {...props} />);
    fireEvent.click(screen.getByTestId('dismiss-btn'));
    expect(mockDismiss).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(mockClose).toHaveBeenCalled();
  });
});
