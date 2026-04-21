import React from 'react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';

const mockRevokeScopes: any = jest.fn(() => ({ type: 'revoke/mock' }));
mockRevokeScopes.pending = 'revokeScopes/pending';
mockRevokeScopes.fulfilled = 'revokeScopes/fulfilled';
mockRevokeScopes.rejected = 'revokeScopes/rejected';
jest.mock('../../../services/actions/revoke-scopes.action', () => ({
  revokeScopes: mockRevokeScopes
}));
jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logOut: jest.fn(),
    getAccount: jest.fn(),
    getSessionId: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn(),
    refreshToken: jest.fn()
  }
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackTabClickEvent: jest.fn(),
    trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: { RESOURCE_DOCUMENTATION_LINK: 'resource-doc', AUTOCOMPLETE_DOCUMENTATION_LINK: 'autocomplete-doc' },
  eventTypes: { LINK_CLICK_EVENT: 'LINK_CLICK_EVENT' },
  errorTypes: {}
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../utils/external-link-validation', () => ({
  validateExternalLink: jest.fn()
}));
jest.mock('./resourcelink.utils', () => ({
  existsInCollection: jest.fn().mockReturnValue(false)
}));
jest.mock('../sidebar-utils/SidebarUtils', () => ({
  METHOD_COLORS: { GET: 'brand', POST: 'success', DELETE: 'danger', PUT: 'warning', PATCH: 'informative' }
}));

import ResourceLink from './ResourceLink';
import { ResourceLinkType, ResourceOptions } from '../../../../types/resources';

describe('ResourceLink', () => {
  const defaultLink = {
    key: 'users',
    name: 'users',
    url: '/users',
    labels: [],
    links: [],
    isExpanded: false,
    parent: '',
    level: 1,
    paths: ['/users'],
    type: ResourceLinkType.NODE,
    method: 'GET',
    docLink: 'https://docs.microsoft.com/users'
  };

  it('renders resource link with method badge', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('renders resource link name when no method', () => {
    const linkWithoutMethod = { ...defaultLink, method: undefined };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={linkWithoutMethod}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.getByText('users')).toBeInTheDocument();
  });

  it('handles add to collection click', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const addButton = screen.getByLabelText('Add to collection');
    fireEvent.click(addButton);

    expect(resourceOptionSelected).toHaveBeenCalledWith(
      ResourceOptions.ADD_TO_COLLECTION,
      defaultLink
    );
  });

  it('handles remove from collection when item is in collection', () => {
    const { existsInCollection } = require('./resourcelink.utils');
    (existsInCollection as jest.Mock).mockReturnValue(true);

    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const removeButton = screen.getByLabelText('Remove from collection');
    fireEvent.click(removeButton);

    expect(resourceOptionSelected).toHaveBeenCalledWith(
      ResourceOptions.REMOVE_FROM_COLLECTION,
      defaultLink
    );

    // Restore
    (existsInCollection as jest.Mock).mockReturnValue(false);
  });

  it('renders documentation link when docLink is present', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const docLink = screen.getByLabelText('Read documentation');
    expect(docLink).toBeInTheDocument();
    expect(docLink).toHaveAttribute('href', 'https://docs.microsoft.com/users');
  });

  it('renders disabled doc link when docLink is absent', () => {
    const linkWithoutDoc = { ...defaultLink, docLink: undefined };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={linkWithoutDoc}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const docLinks = screen.getAllByLabelText('Read documentation');
    // The disabled one should have aria-disabled
    const disabledLink = docLinks.find(el => el.getAttribute('aria-disabled') === 'true');
    expect(disabledLink).toBeDefined();
  });

  it('renders POST method badge with correct text', () => {
    const postLink = { ...defaultLink, method: 'POST' };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={postLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('handles Enter keydown on add to collection button', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const addButton = screen.getByLabelText('Add to collection');
    fireEvent.keyDown(addButton, { key: 'Enter' });
    expect(resourceOptionSelected).toHaveBeenCalledWith(
      ResourceOptions.ADD_TO_COLLECTION,
      defaultLink
    );
  });

  it('handles Enter keydown on remove from collection button', () => {
    const { existsInCollection } = require('./resourcelink.utils');
    (existsInCollection as jest.Mock).mockReturnValue(true);

    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const removeButton = screen.getByLabelText('Remove from collection');
    fireEvent.keyDown(removeButton, { key: 'Enter' });
    expect(resourceOptionSelected).toHaveBeenCalledWith(
      ResourceOptions.REMOVE_FROM_COLLECTION,
      defaultLink
    );

    (existsInCollection as jest.Mock).mockReturnValue(false);
  });

  it('handles documentation link click and tracks event', () => {
    const { telemetry } = require('../../../../telemetry');
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const docLink = screen.getByLabelText('Read documentation');
    fireEvent.click(docLink);
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('handles Enter keydown on documentation link', () => {
    const { telemetry } = require('../../../../telemetry');
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const docLink = screen.getByLabelText('Read documentation');
    fireEvent.keyDown(docLink, { key: 'Enter' });
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('does not show actions when link has no method', () => {
    const linkNoMethod = { ...defaultLink, method: undefined };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={linkNoMethod}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.queryByLabelText('Add to collection')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Remove from collection')).not.toBeInTheDocument();
  });

  it('uses paths from default collection', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: {
            collections: [{ isDefault: true, paths: [{ key: 'users', url: '/users', method: 'GET', version: 'v1.0' }] }],
            saved: false
          }
        }
      }
    );

    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('renders DELETE method badge', () => {
    const deleteLink = { ...defaultLink, method: 'DELETE' };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={deleteLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.getByText('DELETE')).toBeInTheDocument();
  });

  it('renders PATCH method badge', () => {
    const patchLink = { ...defaultLink, method: 'PATCH' };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={patchLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.getByText('PATCH')).toBeInTheDocument();
  });

  it('renders PUT method badge', () => {
    const putLink = { ...defaultLink, method: 'PUT' };
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={putLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    expect(screen.getByText('PUT')).toBeInTheDocument();
  });

  it('does not trigger add on non-Enter keydown', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const addButton = screen.getByLabelText('Add to collection');
    fireEvent.keyDown(addButton, { key: 'Escape' });
    expect(resourceOptionSelected).not.toHaveBeenCalled();
  });

  it('does not trigger remove on non-Enter keydown', () => {
    const { existsInCollection } = require('./resourcelink.utils');
    (existsInCollection as jest.Mock).mockReturnValue(true);

    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const removeButton = screen.getByLabelText('Remove from collection');
    fireEvent.keyDown(removeButton, { key: 'Escape' });
    expect(resourceOptionSelected).not.toHaveBeenCalled();

    (existsInCollection as jest.Mock).mockReturnValue(false);
  });

  it('does not trigger doc link open on non-Enter keydown', () => {
    const { telemetry } = require('../../../../telemetry');
    telemetry.trackEvent.mockClear();
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: [], saved: false }
        }
      }
    );

    const docLink = screen.getByLabelText('Read documentation');
    fireEvent.keyDown(docLink, { key: 'Escape' });
    expect(telemetry.trackEvent).not.toHaveBeenCalled();
  });

  it('handles null collections gracefully', () => {
    const resourceOptionSelected = jest.fn();
    renderWithProviders(
      <ResourceLink
        link={defaultLink}
        resourceOptionSelected={resourceOptionSelected}
        version="v1.0"
      />,
      {
        preloadedState: {
          collections: { collections: null as any, saved: false }
        }
      }
    );

    expect(screen.getByText('GET')).toBeInTheDocument();
  });
});
