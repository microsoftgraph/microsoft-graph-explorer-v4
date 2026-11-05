jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import React from 'react';
import '@testing-library/jest-dom';
import { act, render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled();
  });

  it('keeps Close available outside suspended content and dismisses while loading', async () => {
    let resolveComponent!: (module: { default: typeof MockComponent }) => void;
    const LazyComponent = React.lazy(() => new Promise<{ default: typeof MockComponent }>(resolve => {
      resolveComponent = resolve;
    }));
    render(<DialogWrapper {...defaultProps} Component={LazyComponent} />);
    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-component')).not.toBeInTheDocument();
    expect(closeButton).toBeVisible();
    expect(closeButton).toBeEnabled();
    fireEvent.click(closeButton);
    expect(mockDismiss).toHaveBeenCalledTimes(1);
    await act(async () => { resolveComponent({ default: MockComponent }); });
    expect(screen.getByTestId('mock-component')).toBeInTheDocument();
    expect(closeButton).toBeVisible();
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

  describe('initial focus', () => {
    const FormComponent = () => (
      <form>
        <label>First field<input /></label>
        <button type='button'>Cancel</button>
      </form>
    );

    it('focuses the first content field rather than the Close button', () => {
      render(<DialogWrapper {...defaultProps} Component={FormComponent} />);
      expect(screen.getByRole('textbox', { name: 'First field' })).toHaveFocus();
    });

    it('focuses the first footer control when the content has no focusable elements', () => {
      const props = {
        ...defaultProps,
        popupsProps: {
          ...defaultProps.popupsProps,
          settings: { ...defaultProps.popupsProps.settings, renderFooter: () => <button>Save</button> }
        }
      };
      render(<DialogWrapper {...props} />);
      expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    });

    it('leaves focus on Close when the dialog has no other focusable elements', () => {
      render(<DialogWrapper {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    it('moves focus to the first field once lazy content loads', async () => {
      let resolveComponent!: (module: { default: typeof FormComponent }) => void;
      const LazyComponent = React.lazy(() => new Promise<{ default: typeof FormComponent }>(resolve => {
        resolveComponent = resolve;
      }));
      render(<DialogWrapper {...defaultProps} Component={LazyComponent} />);
      await act(async () => { resolveComponent({ default: FormComponent }); });
      expect(screen.getByRole('textbox', { name: 'First field' })).toHaveFocus();
    });

    it('does not take focus back from a content control on re-render', () => {
      const { rerender } = render(<DialogWrapper {...defaultProps} Component={FormComponent} />);
      const cancel = screen.getByRole('button', { name: 'Cancel' });
      act(() => cancel.focus());
      rerender(<DialogWrapper {...defaultProps} Component={FormComponent} />);
      expect(cancel).toHaveFocus();
    });
  });
});
