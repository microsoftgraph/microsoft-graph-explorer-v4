jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DrawerWrapper } from './DrawerWrapper';

describe('DrawerWrapper', () => {
  const mockDismiss = jest.fn();
  const mockClose = jest.fn();
  const MockComponent = (props: any) => <div data-testid="mock-component">Component Content</div>;

  const defaultProps = {
    isOpen: true,
    dismissPopup: mockDismiss,
    closePopup: mockClose,
    Component: MockComponent,
    popupsProps: {
      settings: {
        title: 'Test Panel',
        width: 'md' as const
      },
      data: {}
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(<DrawerWrapper {...defaultProps} />);
    expect(screen.getByText('Test Panel')).toBeDefined();
  });

  it('renders component content', () => {
    render(<DrawerWrapper {...defaultProps} />);
    expect(screen.getByTestId('mock-component')).toBeDefined();
  });

  it('renders with different drawer sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];
    sizes.forEach(width => {
      const props = {
        ...defaultProps,
        popupsProps: { ...defaultProps.popupsProps, settings: { ...defaultProps.popupsProps.settings, width } }
      };
      const { unmount } = render(<DrawerWrapper {...props} />);
      unmount();
    });
  });

  it('shows back button for Edit Scope title', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, title: 'Edit Scope' }
      }
    };
    render(<DrawerWrapper {...props} />);
    expect(screen.getByLabelText('Back')).toBeDefined();
  });

  it('shows back button for Edit Collection title', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, title: 'Edit Collection' }
      }
    };
    render(<DrawerWrapper {...props} />);
    expect(screen.getByLabelText('Back')).toBeDefined();
  });

  it('shows back button for Preview Permissions title', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, title: 'Preview Permissions' }
      }
    };
    render(<DrawerWrapper {...props} />);
    expect(screen.getByLabelText('Back')).toBeDefined();
  });

  it('does not show back button for unrelated title', () => {
    render(<DrawerWrapper {...defaultProps} />);
    expect(screen.queryByLabelText('Back')).toBeNull();
  });

  it('renders footer when renderFooter is provided', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: {
          ...defaultProps.popupsProps.settings,
          renderFooter: () => <div data-testid="custom-footer">Footer content</div>
        }
      }
    };
    render(<DrawerWrapper {...props} />);
    expect(screen.getByTestId('custom-footer')).toBeDefined();
  });

  it('does not render footer when renderFooter is not provided', () => {
    render(<DrawerWrapper {...defaultProps} />);
    expect(screen.queryByTestId('custom-footer')).toBeNull();
  });

  it('renders with default/unknown width size', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, width: 'unknown' as any }
      }
    };
    const { unmount } = render(<DrawerWrapper {...props} />);
    expect(screen.getByText('Test Panel')).toBeDefined();
    unmount();
  });

  it('clicking close button calls dismissPopup', () => {
    render(<DrawerWrapper {...defaultProps} />);
    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('clicking back button on Edit Scope calls dismissPopup', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        ...defaultProps.popupsProps,
        settings: { ...defaultProps.popupsProps.settings, title: 'Edit Scope' }
      }
    };
    render(<DrawerWrapper {...props} />);
    const backBtn = screen.getByLabelText('Back');
    fireEvent.click(backBtn);
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('passes data and dismissPopup to Component', () => {
    const MockTracker = (props: any) => (
      <div data-testid="mock-tracker">
        {props.data ? 'has-data' : 'no-data'}
      </div>
    );
    const props = {
      ...defaultProps,
      Component: MockTracker,
      popupsProps: {
        settings: { title: 'Test', width: 'md' as const },
        data: { key: 'value' }
      }
    };
    render(<DrawerWrapper {...props} />);
    expect(screen.getByText('has-data')).toBeDefined();
  });

  it('passes closePopup to Component and calls it on click', () => {
    const MockComp = (props: any) => (
      <div>
        <button data-testid="close-from-comp" onClick={(e: any) => props.closePopup(e)}>Close Inner</button>
      </div>
    );
    const props = { ...defaultProps, Component: MockComp };
    render(<DrawerWrapper {...props} />);
    fireEvent.click(screen.getByTestId('close-from-comp'));
    expect(mockClose).toHaveBeenCalled();
  });
});
