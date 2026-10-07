jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../../../store', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => jest.fn())
}));
jest.mock('./Paths', () => ({
  __esModule: true,
  default: ({ resources, onSelectionChange }: any) => (
    <div data-testid="paths">
      <span>{resources.length} items</span>
      <button onClick={() => onSelectionChange([{ url: '/me', method: 'GET' }])}>Select</button>
    </div>
  )
}));
jest.mock('./CommonCollectionsPanel', () => ({
  __esModule: true,
  default: ({ children, primaryButtonAction, primaryButtonDisabled, primaryButtonText, closePopup }: any) => (
    <div>
      <button disabled={primaryButtonDisabled} onClick={primaryButtonAction}>{primaryButtonText}</button>
      <button onClick={closePopup}>Close</button>
      {children}
    </div>
  )
}));

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditCollectionPanel from './EditCollectionPanel';
import { useAppSelector, useAppDispatch } from '../../../../../store';

describe('EditCollectionPanel', () => {
  const mockDispatch = jest.fn();
  const mockClosePopup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('renders empty message when no collections', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({ collections: { collections: [] } })
    );
    render(<EditCollectionPanel closePopup={mockClosePopup} />);
    expect(screen.getByText('No items available')).toBeDefined();
  });

  it('renders paths when collections have items', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({
        collections: {
          collections: [{
            isDefault: true,
            paths: [{ url: '/me', method: 'GET', version: 'v1.0' }]
          }]
        }
      })
    );
    render(<EditCollectionPanel closePopup={mockClosePopup} />);
    expect(screen.getByTestId('paths')).toBeDefined();
    expect(screen.getByText('1 items')).toBeDefined();
  });

  it('delete button is disabled initially', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({
        collections: {
          collections: [{
            isDefault: true,
            paths: [{ url: '/me', method: 'GET', version: 'v1.0' }]
          }]
        }
      })
    );
    render(<EditCollectionPanel closePopup={mockClosePopup} />);
    expect(screen.getByText('Delete all selected')).toBeDisabled();
  });

  it('enables delete when items selected', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({
        collections: {
          collections: [{
            isDefault: true,
            paths: [{ url: '/me', method: 'GET', version: 'v1.0' }]
          }]
        }
      })
    );
    render(<EditCollectionPanel closePopup={mockClosePopup} />);
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByText('Delete all selected')).not.toBeDisabled();
  });

  it('dispatches removeResourcePaths on delete', () => {
    (useAppSelector as unknown as jest.Mock).mockImplementation((fn: any) =>
      fn({
        collections: {
          collections: [{
            isDefault: true,
            paths: [{ url: '/me', method: 'GET', version: 'v1.0' }]
          }]
        }
      })
    );
    render(<EditCollectionPanel closePopup={mockClosePopup} />);
    fireEvent.click(screen.getByText('Select'));
    fireEvent.click(screen.getByText('Delete all selected'));
    expect(mockDispatch).toHaveBeenCalled();
  });
});
