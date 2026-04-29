jest.mock('../../../services/context/popups-context', () => ({
  POPUPS: { DELETE_POPUPS: 'DELETE_POPUPS' },
  usePopupsStateContext: jest.fn(() => ({ popups: [] })),
  usePopupsDispatchContext: jest.fn(() => jest.fn())
}));

let mockDrawerProps: any = null;
let mockDialogProps: any = null;
let mockModalProps: any = null;
jest.mock('./DialogWrapper', () => ({
  DialogWrapper: (props: any) => {
    mockDialogProps = props;
    return (
      <div data-testid="dialog">Dialog
        <button data-testid="dialog-close" onClick={() => props.closePopup('result')}>Close</button>
        <button data-testid="dialog-dismiss" onClick={props.dismissPopup}>Dismiss</button>
      </div>
    );
  }
}));
jest.mock('./ModalWrapper', () => ({
  ModalWrapper: (props: any) => {
    mockModalProps = props;
    return (
      <div data-testid="modal">Modal
        <button data-testid="modal-close" onClick={() => props.closePopup(null)}>Close</button>
        <button data-testid="modal-dismiss" onClick={props.dismissPopup}>Dismiss</button>
      </div>
    );
  }
}));
jest.mock('./DrawerWrapper', () => ({
  DrawerWrapper: (props: any) => {
    mockDrawerProps = props;
    return (
      <div data-testid="drawer">Drawer
        <button data-testid="drawer-close" onClick={() => props.closePopup('saved')}>Close</button>
        <button data-testid="drawer-dismiss" onClick={props.dismissPopup}>Dismiss</button>
      </div>
    );
  }
}));
jest.mock('../error-boundary/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopupsWrapper from './PopupsWrapper';
import { usePopupsStateContext, usePopupsDispatchContext } from '../../../services/context/popups-context';

describe('PopupsWrapper', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    (usePopupsDispatchContext as jest.Mock).mockReturnValue(mockDispatch);
    mockDrawerProps = null;
    mockDialogProps = null;
    mockModalProps = null;
  });

  it('renders empty when no popups', () => {
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [] });
    const { container } = render(<PopupsWrapper />);
    expect(container).toBeDefined();
  });

  it('renders drawer for panel type', () => {
    (usePopupsStateContext as jest.Mock).mockReturnValue({
      popups: [{
        id: '1',
        type: 'panel',
        isOpen: true,
        component: () => <div>Content</div>,
        popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
      }]
    });
    render(<PopupsWrapper />);
    expect(screen.getByTestId('drawer')).toBeDefined();
  });

  it('renders dialog for dialog type', () => {
    (usePopupsStateContext as jest.Mock).mockReturnValue({
      popups: [{
        id: '2',
        type: 'dialog',
        isOpen: true,
        component: () => <div>Content</div>,
        popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
      }]
    });
    render(<PopupsWrapper />);
    expect(screen.getByTestId('dialog')).toBeDefined();
  });

  it('renders modal for other types', () => {
    (usePopupsStateContext as jest.Mock).mockReturnValue({
      popups: [{
        id: '3',
        type: 'modal',
        isOpen: true,
        component: () => <div>Content</div>,
        popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
      }]
    });
    render(<PopupsWrapper />);
    expect(screen.getByTestId('modal')).toBeDefined();
  });

  it('dispatches DELETE_POPUPS on close with result', () => {
    const popup = {
      id: '4',
      type: 'dialog',
      isOpen: true,
      component: () => <div>Content</div>,
      popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
    };
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [popup] });
    render(<PopupsWrapper />);
    fireEvent.click(screen.getByTestId('dialog-close'));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_POPUPS'
    }));
  });

  it('dispatches DELETE_POPUPS on dismiss', () => {
    const popup = {
      id: '5',
      type: 'panel',
      isOpen: true,
      component: () => <div>Content</div>,
      popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
    };
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [popup] });
    render(<PopupsWrapper />);
    fireEvent.click(screen.getByTestId('drawer-dismiss'));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_POPUPS'
    }));
  });

  it('focuses trigger button on close when trigger ref exists', () => {
    const mockFocus = jest.fn();
    const triggerRef = { current: { focus: mockFocus } };
    const popup = {
      id: '6',
      type: 'modal',
      isOpen: true,
      component: () => <div>Content</div>,
      popupsProps: { settings: { title: 'Test', trigger: triggerRef } }
    };
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [popup] });
    render(<PopupsWrapper />);
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(mockFocus).toHaveBeenCalled();
  });

  it('focuses trigger button on dismiss when trigger ref exists', () => {
    const mockFocus = jest.fn();
    const triggerRef = { current: { focus: mockFocus } };
    const popup = {
      id: '7',
      type: 'dialog',
      isOpen: true,
      component: () => <div>Content</div>,
      popupsProps: { settings: { title: 'Test', trigger: triggerRef } }
    };
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [popup] });
    render(<PopupsWrapper />);
    fireEvent.click(screen.getByTestId('dialog-dismiss'));
    expect(mockFocus).toHaveBeenCalled();
  });

  it('renders multiple popups simultaneously', () => {
    (usePopupsStateContext as jest.Mock).mockReturnValue({
      popups: [
        {
          id: '8',
          type: 'panel',
          isOpen: true,
          component: () => <div>Panel</div>,
          popupsProps: { settings: { title: 'Panel', trigger: { current: null } } }
        },
        {
          id: '9',
          type: 'dialog',
          isOpen: true,
          component: () => <div>Dialog</div>,
          popupsProps: { settings: { title: 'Dialog', trigger: { current: null } } }
        }
      ]
    });
    render(<PopupsWrapper />);
    expect(screen.getByTestId('drawer')).toBeDefined();
    expect(screen.getByTestId('dialog')).toBeDefined();
  });

  it('does not render popup when component is null', () => {
    (usePopupsStateContext as jest.Mock).mockReturnValue({
      popups: [{
        id: '10',
        type: 'panel',
        isOpen: true,
        component: null,
        popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
      }]
    });
    render(<PopupsWrapper />);
    expect(screen.queryByTestId('drawer')).toBeNull();
  });

  it('sets result on payload when close is called with a result', () => {
    const popup = {
      id: '11',
      type: 'dialog',
      isOpen: true,
      component: () => <div>Content</div>,
      popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
    };
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [popup] });
    render(<PopupsWrapper />);
    fireEvent.click(screen.getByTestId('dialog-close'));
    const dispatchCall = mockDispatch.mock.calls[0][0];
    expect(dispatchCall.payload.result).toBe('result');
    expect(dispatchCall.payload.status).toBe('closed');
  });

  it('sets dismissed status on payload when dismiss is called', () => {
    const popup = {
      id: '12',
      type: 'panel',
      isOpen: true,
      component: () => <div>Content</div>,
      popupsProps: { settings: { title: 'Test', trigger: { current: null } } }
    };
    (usePopupsStateContext as jest.Mock).mockReturnValue({ popups: [popup] });
    render(<PopupsWrapper />);
    fireEvent.click(screen.getByTestId('drawer-dismiss'));
    const dispatchCall = mockDispatch.mock.calls[0][0];
    expect(dispatchCall.payload.status).toBe('dismissed');
  });
});
