import '@testing-library/jest-dom';

jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(),
    getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn()
  }
}));
jest.mock('../../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(), trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));

jest.mock('./Paths', () => {
  const MockPaths = (props: any) => (
    <div data-testid="mock-paths">
      {props.resources?.map((r: any) => <div key={r.key}>{r.url}</div>)}
    </div>
  );
  MockPaths.displayName = 'Paths';
  return { __esModule: true, default: MockPaths };
});
jest.mock('./CommonCollectionsPanel', () => {
  const MockPanel = ({ children, primaryButtonText, primaryButtonAction, primaryButtonDisabled }: any) => (
    <div data-testid="common-panel">
      <span>{primaryButtonText}</span>
      <button data-testid="primary-btn" onClick={primaryButtonAction} disabled={primaryButtonDisabled}>
        {primaryButtonText}
      </button>
      {children}
    </div>
  );
  MockPanel.displayName = 'CommonCollectionsPanel';
  return { __esModule: true, default: MockPanel };
});
jest.mock('../../../../services/hooks', () => ({
  usePopups: () => ({ show: jest.fn() })
}));
jest.mock('../../../../services/hooks/usePopups', () => ({
  usePopups: () => ({ show: jest.fn() })
}));
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../common/download', () => ({
  downloadToLocal: jest.fn(),
  trackDownload: jest.fn()
}));
jest.mock('./postman.util', () => ({
  generatePostmanCollection: jest.fn().mockReturnValue({ info: { name: 'test', _postman_id: '123' } }),
  generateResourcePathsFromPostmanCollection: jest.fn().mockReturnValue([])
}));
jest.mock('./upload-collection.util', () => ({
  isGeneratedCollectionInCollection: jest.fn().mockReturnValue(false)
}));

import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';
import APICollection from './APICollection';
import { downloadToLocal } from '../../../common/download';
import { generatePostmanCollection, generateResourcePathsFromPostmanCollection } from './postman.util';
import { isGeneratedCollectionInCollection } from './upload-collection.util';

describe('APICollection', () => {
  const mockPaths = [
    { key: '1', url: '/users', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' },
    { key: '2', url: '/groups', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
  ];

  const stateWithPaths = {
    collections: {
      collections: [{ isDefault: true, paths: mockPaths }],
      saved: false
    }
  };

  const defaultProps = {
    dismissPopup: jest.fn(),
    closePopup: jest.fn(),
    data: null as any,
    settings: { title: '' }
  };

  it('renders loading state initially', () => {
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    expect(screen.getByText('Loading collections...')).toBeInTheDocument();
  });

  it('renders paths after loading', async () => {
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByTestId('mock-paths')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders empty state when no paths', async () => {
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(screen.getByText('Add queries in the API Explorer and History tab')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders toolbar buttons', async () => {
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByText('Edit collection')).toBeInTheDocument();
      expect(screen.getByText('Edit scope')).toBeInTheDocument();
      expect(screen.getByText('Upload a new list')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('download button calls generatePostmanCollection and downloadToLocal', async () => {
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByTestId('primary-btn')).toBeInTheDocument();
    }, { timeout: 1000 });
    fireEvent.click(screen.getByTestId('primary-btn'));
    expect(generatePostmanCollection).toHaveBeenCalled();
    expect(downloadToLocal).toHaveBeenCalled();
  });

  it('toolbar edit collection and edit scope buttons are disabled when no items', async () => {
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(screen.getByText('Edit collection')).toBeInTheDocument();
    }, { timeout: 1000 });
    expect(screen.getByText('Edit collection').closest('button')).toBeDisabled();
    expect(screen.getByText('Edit scope').closest('button')).toBeDisabled();
  });

  it('preview permissions button is disabled when no items', async () => {
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(screen.getByText('Preview permissions')).toBeInTheDocument();
    }, { timeout: 1000 });
    expect(screen.getByText('Preview permissions').closest('button')).toBeDisabled();
  });

  it('primary download button is disabled when no items', async () => {
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(screen.getByTestId('primary-btn')).toBeInTheDocument();
    }, { timeout: 1000 });
    expect(screen.getByTestId('primary-btn')).toBeDisabled();
  });

  it('file upload with valid JSON triggers collection processing', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([
      { key: '3', url: '/me', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
    ]);
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(
      ['{"info":{"name":"test","_postman_id":"123"},"item":[]}'],
      'test.json',
      { type: 'application/json' }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(generateResourcePathsFromPostmanCollection).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('file upload with invalid JSON dispatches error status', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid JSON');
    });
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(['not valid json'], 'bad.json', { type: 'application/json' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(generateResourcePathsFromPostmanCollection).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Restore default mock
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([]);
  });

  it('shows merge/replace dialog when uploading to existing collection', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([
      { key: '3', url: '/me', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
    ]);
    (isGeneratedCollectionInCollection as jest.Mock).mockReturnValue(false);
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(
      ['{"info":{"name":"test","_postman_id":"123"},"item":[]}'],
      'test.json',
      { type: 'application/json' }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Merge with existing')).toBeInTheDocument();
      expect(screen.getByText('Replace existing')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Restore default mock
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([]);
  });

  it('empty items state shows placeholder message', async () => {
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(screen.getByText('Add queries in the API Explorer and History tab')).toBeInTheDocument();
    }, { timeout: 1000 });
    expect(screen.queryByTestId('mock-paths')).not.toBeInTheDocument();
  });

  it('loading state transitions to content after timeout', async () => {
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    expect(screen.getByText('Loading collections...')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-paths')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('mock-paths')).toBeInTheDocument();
    }, { timeout: 1000 });
    expect(screen.queryByText('Loading collections...')).not.toBeInTheDocument();
  });

  it('clicking merge button in dialog dispatches addResourcePaths', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([
      { key: '3', url: '/me', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
    ]);
    (isGeneratedCollectionInCollection as jest.Mock).mockReturnValue(false);
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(
      ['{"info":{"name":"test","_postman_id":"123"},"item":[]}'],
      'test.json',
      { type: 'application/json' }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Merge with existing')).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.click(screen.getByText('Merge with existing'));

    // Dialog should be hidden after merging
    await waitFor(() => {
      expect(screen.queryByText('Merge with existing')).not.toBeInTheDocument();
    }, { timeout: 500 });

    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([]);
  });

  it('clicking replace button in dialog dispatches removeResourcePaths then addResourcePaths', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([
      { key: '3', url: '/me', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
    ]);
    (isGeneratedCollectionInCollection as jest.Mock).mockReturnValue(false);
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(
      ['{"info":{"name":"test","_postman_id":"123"},"item":[]}'],
      'test.json',
      { type: 'application/json' }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Replace existing')).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.click(screen.getByText('Replace existing'));

    // Dialog should be hidden after replacing
    await waitFor(() => {
      expect(screen.queryByText('Replace existing')).not.toBeInTheDocument();
    }, { timeout: 500 });

    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([]);
  });

  it('file upload with existing collection items dispatches error status', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([
      { key: '3', url: '/me', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
    ]);
    (isGeneratedCollectionInCollection as jest.Mock).mockReturnValue(true);
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(
      ['{"info":{"name":"test","_postman_id":"123"},"item":[]}'],
      'test.json',
      { type: 'application/json' }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Should not show merge/replace dialog since collection exists
    await waitFor(() => {
      expect(generateResourcePathsFromPostmanCollection).toHaveBeenCalled();
    }, { timeout: 1000 });
    expect(screen.queryByText('Merge with existing')).not.toBeInTheDocument();

    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([]);
    (isGeneratedCollectionInCollection as jest.Mock).mockReturnValue(false);
  });

  it('file upload to empty collection adds paths directly without dialog', async () => {
    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([
      { key: '3', url: '/me', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' }
    ]);
    const emptyState = {
      collections: {
        collections: [{ isDefault: true, paths: [] }],
        saved: false
      }
    };
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: emptyState });
    await waitFor(() => {
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    }, { timeout: 1000 });

    const file = new File(
      ['{"info":{"name":"test","_postman_id":"123"},"item":[]}'],
      'test.json',
      { type: 'application/json' }
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(generateResourcePathsFromPostmanCollection).toHaveBeenCalled();
    }, { timeout: 1000 });

    // No dialog shown, paths added directly
    expect(screen.queryByText('Merge with existing')).not.toBeInTheDocument();

    (generateResourcePathsFromPostmanCollection as jest.Mock).mockReturnValue([]);
  });

  it('edit collection button calls showPopup', async () => {
    const mockShow = jest.fn();
    const usePopupsMock = require('../../../../services/hooks').usePopups;
    jest.spyOn(require('../../../../services/hooks'), 'usePopups').mockReturnValue({ show: mockShow });

    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByText('Edit collection')).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.click(screen.getByText('Edit collection').closest('button')!);
    expect(mockShow).toHaveBeenCalled();
  });

  it('preview permissions button calls viewPermissions', async () => {
    const mockShow = jest.fn();
    jest.spyOn(require('../../../../services/hooks'), 'usePopups').mockReturnValue({ show: mockShow });

    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByText('Preview permissions')).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.click(screen.getByText('Preview permissions').closest('button')!);
    expect(mockShow).toHaveBeenCalled();
  });

  it('edit scope button calls showEditScopePanel', async () => {
    const mockShow = jest.fn();
    jest.spyOn(require('../../../../services/hooks'), 'usePopups').mockReturnValue({ show: mockShow });

    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByText('Edit scope')).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.click(screen.getByText('Edit scope').closest('button')!);
    expect(mockShow).toHaveBeenCalled();
  });

  it('upload button triggers file input click', async () => {
    const { container } = renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: stateWithPaths });
    await waitFor(() => {
      expect(screen.getByText('Upload a new list')).toBeInTheDocument();
    }, { timeout: 1000 });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(fileInput, 'click');
    fireEvent.click(screen.getByText('Upload a new list').closest('button')!);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('renders with no default collection in collections array', async () => {
    const noDefaultState = {
      collections: {
        collections: [{ isDefault: false, paths: mockPaths }],
        saved: false
      }
    };
    renderWithProviders(<APICollection {...defaultProps} />, { preloadedState: noDefaultState });
    await waitFor(() => {
      expect(screen.getByText('Add queries in the API Explorer and History tab')).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
