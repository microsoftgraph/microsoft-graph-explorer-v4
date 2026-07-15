import React from 'react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';

jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import { ModalWrapper } from './ModalWrapper';

describe('ModalWrapper', () => {
  const mockDismissPopup = jest.fn();
  const mockClosePopup = jest.fn();
  const MockComponent = (props: any) => <div data-testid="inner-component">{JSON.stringify(props.data)}</div>;

  const defaultProps = {
    isOpen: true,
    dismissPopup: mockDismissPopup,
    closePopup: mockClosePopup,
    Component: MockComponent,
    popupsProps: {
      settings: { title: 'Test Dialog' },
      data: { key: 'value' }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with title when open', () => {
    render(<ModalWrapper {...defaultProps} />);
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('renders the inner component with data', () => {
    render(<ModalWrapper {...defaultProps} />);
    expect(screen.getByTestId('inner-component')).toBeInTheDocument();
    expect(screen.getByTestId('inner-component')).toHaveTextContent('{"key":"value"}');
  });

  it('renders with empty data when popupsProps.data is undefined', () => {
    const props = {
      ...defaultProps,
      popupsProps: { settings: { title: 'No Data' }, data: undefined }
    };
    render(<ModalWrapper {...props} />);
    expect(screen.getByTestId('inner-component')).toHaveTextContent('{}');
  });

  it('renders footer when renderFooter is provided', () => {
    const props = {
      ...defaultProps,
      popupsProps: {
        settings: {
          title: 'With Footer',
          renderFooter: () => <button>Footer Button</button>
        },
        data: {}
      }
    };
    render(<ModalWrapper {...props} />);
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('does not render footer when renderFooter is not provided', () => {
    render(<ModalWrapper {...defaultProps} />);
    expect(screen.queryByText('Footer Button')).not.toBeInTheDocument();
  });

  it('calls closePopup when dismiss icon is clicked', () => {
    render(<ModalWrapper {...defaultProps} />);
    const dismissIcon = screen.getByLabelText('Close expanded response area');
    fireEvent.click(dismissIcon);
    expect(mockClosePopup).toHaveBeenCalled();
  });

  it('does not render dialog content when isOpen is false', () => {
    const props = { ...defaultProps, isOpen: false };
    render(<ModalWrapper {...props} />);
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });
});
