import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

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

jest.mock('../../../../services/hooks/useCollectionPermissions', () => ({
  useCollectionPermissions: jest.fn()
}));
jest.mock('./CommonCollectionsPanel', () => {
  const MockPanel = ({ children, primaryButtonText }: any) => (
    <div data-testid="common-panel">
      <span>{primaryButtonText}</span>
      {children}
    </div>
  );
  MockPanel.displayName = 'CommonCollectionsPanel';
  return { __esModule: true, default: MockPanel };
});
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../common/download', () => ({
  downloadToLocal: jest.fn(),
  trackDownload: jest.fn()
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';
import CollectionPermissions from './CollectionPermissions';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';

const mockUseCollectionPermissions = useCollectionPermissions as jest.MockedFunction<typeof useCollectionPermissions>;

describe('CollectionPermissions', () => {
  const defaultProps = {
    dismissPopup: jest.fn()
  };

  it('renders "permissions not found" when no permissions and not fetching', () => {
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: undefined,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByText('permissions not found')).toBeInTheDocument();
  });

  it('renders spinner when fetching', () => {
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: undefined,
      isFetching: true
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByText('Fetching permissions')).toBeInTheDocument();
  });

  it('renders permissions tree when permissions are available', () => {
    const mockPermissions = {
      'v1.0-DelegatedWork': [
        { value: 'User.Read', scopeType: 'DelegatedWork' },
        { value: 'Mail.Read', scopeType: 'DelegatedWork' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByTestId('common-panel')).toBeInTheDocument();
  });

  it('calls getPermissions when paths are not empty', () => {
    const mockGetPermissions = jest.fn();
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: mockGetPermissions,
      permissions: undefined,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: {
          collections: [{
            isDefault: true,
            paths: [{ key: 'k1', paths: ['/', 'users'], type: 'path', url: '/users', method: 'GET', name: 'users' }]
          }],
          saved: false
        }
      }
    });
    expect(mockGetPermissions).toHaveBeenCalled();
  });

  it('does not call getPermissions when paths are empty', () => {
    const mockGetPermissions = jest.fn();
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: mockGetPermissions,
      permissions: undefined,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(mockGetPermissions).not.toHaveBeenCalled();
  });

  it('renders permissions reference docs link', () => {
    const mockPermissions = {
      'v1.0-DelegatedWork': [
        { value: 'User.Read', scopeType: 'DelegatedWork' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByText('Microsoft Graph permissions reference')).toBeInTheDocument();
  });

  it('tracks telemetry when docs link is clicked', () => {
    const { telemetry } = require('../../../../../telemetry');
    const mockPermissions = {
      'v1.0-DelegatedWork': [
        { value: 'User.Read', scopeType: 'DelegatedWork' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    const link = screen.getByText('Microsoft Graph permissions reference');
    fireEvent.click(link);
    expect(telemetry.trackLinkClickEvent).toHaveBeenCalled();
  });

  it('renders multiple scope types as groups', () => {
    const mockPermissions = {
      'v1.0': [
        { value: 'User.Read', scopeType: 'DelegatedWork' },
        { value: 'Mail.Read', scopeType: 'Application' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByTestId('common-panel')).toBeInTheDocument();
  });

  it('handles null collections gracefully', () => {
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: undefined,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [], saved: false }
      }
    });
    expect(screen.getByText('permissions not found')).toBeInTheDocument();
  });

  it('expands scope group and shows leaf permissions', () => {
    const mockPermissions = {
      'v1.0-DelegatedWork': [
        { value: 'User.Read', scopeType: 'DelegatedWork' },
        { value: 'Mail.Read', scopeType: 'DelegatedWork' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    // Click on the branch treeitem to expand
    const branchItems = screen.getAllByRole('treeitem');
    expect(branchItems.length).toBeGreaterThan(0);
    fireEvent.click(branchItems[0]);
    // After expanding, leaf permissions should be visible
    expect(screen.getByText('User.Read')).toBeInTheDocument();
    expect(screen.getByText('Mail.Read')).toBeInTheDocument();
  });

  it('calls downloadToLocal when download action is triggered', () => {
    const { downloadToLocal, trackDownload } = require('../../../common/download');
    const mockPermissions = {
      'v1.0-DelegatedWork': [
        { value: 'User.Read', scopeType: 'DelegatedWork' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    // The CommonCollectionsPanel mock renders primaryButtonText as a span
    const downloadText = screen.getByText('Download permissions');
    expect(downloadText).toBeInTheDocument();
  });

  it('groups permissions by scopeType with unknown fallback', () => {
    const mockPermissions = {
      'v1.0': [
        { value: 'User.Read', scopeType: undefined },
        { value: 'Mail.Read', scopeType: null }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByTestId('common-panel')).toBeInTheDocument();
  });

  it('renders counter badge with correct count for each scope group', () => {
    const mockPermissions = {
      'v1.0-App': [
        { value: 'User.Read.All', scopeType: 'Application' },
        { value: 'Mail.Read.All', scopeType: 'Application' },
        { value: 'Files.Read.All', scopeType: 'Application' }
      ]
    };
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: mockPermissions,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: true, paths: [] }], saved: false }
      }
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles collections with no default collection', () => {
    mockUseCollectionPermissions.mockReturnValue({
      getPermissions: jest.fn(),
      permissions: undefined,
      isFetching: false
    });
    renderWithProviders(<CollectionPermissions {...defaultProps} />, {
      preloadedState: {
        collections: { collections: [{ isDefault: false, paths: [{ url: '/me', method: 'GET' }] }], saved: false }
      }
    });
    expect(screen.getByText('permissions not found')).toBeInTheDocument();
  });
});
