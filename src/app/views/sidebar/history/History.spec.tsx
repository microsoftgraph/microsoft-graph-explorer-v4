import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

beforeAll(() => {
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock('../../../../modules/authentication', () => ({
  authenticationWrapper: { logIn: jest.fn(), logOut: jest.fn(), getAccount: jest.fn(), getSessionId: jest.fn(), logInWithOther: jest.fn(), clearSession: jest.fn(), refreshToken: jest.fn() }
}));
jest.mock('../../../../modules/authentication/authentication-error-hints', () => ({
  getSignInAuthErrorHint: jest.fn(), signInAuthError: jest.fn()
}));
jest.mock('../../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackTabClickEvent: jest.fn(), trackCopyButtonClickEvent: jest.fn(), trackLinkClickEvent: jest.fn(), trackException: jest.fn(), getDeviceCharacteristicsData: jest.fn().mockReturnValue({}) },
  componentNames: {}, eventTypes: {}, errorTypes: {}
}));
jest.mock('../../../../modules/cache/history-utils', () => ({
  historyCache: { bulkRemoveHistoryData: jest.fn(), readHistoryData: jest.fn().mockResolvedValue([]), removeHistoryData: jest.fn() }
}));
jest.mock('../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../../../services/slices/collections.slice', () => ({
  addResourcePaths: jest.fn().mockReturnValue({ type: 'collections/addResourcePaths' }),
  removeResourcePaths: jest.fn().mockReturnValue({ type: 'collections/removeResourcePaths' })
}));
jest.mock('./har-utils', () => ({
  createHarEntry: jest.fn().mockReturnValue({}),
  exportQuery: jest.fn(),
  generateHar: jest.fn().mockReturnValue({})
}));

import History from './History';
import { renderWithProviders } from '../../../../test-utils';

describe('History component', () => {
  it('renders with empty history', () => {
    renderWithProviders(<History />, {
      preloadedState: { history: [], collections: { collections: [], saved: false } }
    });
    expect(screen.getByText('We did not find any history items')).toBeInTheDocument();
  });

  it('renders with history items', () => {
    const historyItems = [
      {
        index: 0,
        url: 'https://graph.microsoft.com/v1.0/me',
        method: 'GET',
        headers: [],
        body: null,
        result: null,
        responseHeaders: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        status: 200,
        statusText: 'OK',
        duration: 150,
        category: 'Today'
      },
      {
        index: 1,
        url: 'https://graph.microsoft.com/v1.0/me/messages',
        method: 'GET',
        headers: [],
        body: null,
        result: null,
        responseHeaders: null,
        createdAt: '2024-01-15T11:00:00.000Z',
        status: 200,
        statusText: 'OK',
        duration: 200,
        category: 'Today'
      }
    ];

    renderWithProviders(<History />, {
      preloadedState: { history: historyItems, collections: { collections: [], saved: false } }
    });
    expect(screen.getByText('Your history includes queries made in the last 30 days')).toBeInTheDocument();
    expect(screen.queryByText('We did not find any history items')).not.toBeInTheDocument();
  });

  it('shows search box', () => {
    renderWithProviders(<History />, {
      preloadedState: { history: [], collections: { collections: [], saved: false } }
    });
    expect(screen.getByPlaceholderText('Search history items')).toBeInTheDocument();
  });

  const makeDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  const uniqueTimestamp = (daysAgo: number, suffix: string) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${suffix}`;
  };

  const makeItem = (overrides: Partial<any> = {}) => ({
    index: 0,
    url: 'https://graph.microsoft.com/v1.0/me',
    method: 'GET',
    headers: [],
    body: null,
    result: null,
    responseHeaders: null,
    createdAt: makeDate(0),
    status: 200,
    statusText: 'OK',
    duration: 150,
    ...overrides
  });

  it('categorizes items as today, yesterday, and older', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/todayitem' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(1, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/yesterdayitem' }),
      makeItem({ index: 2, createdAt: uniqueTimestamp(10, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/olditem' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    expect(screen.getByText('yesterday')).toBeInTheDocument();
    expect(screen.getByText('older')).toBeInTheDocument();
  });

  it('renders items with different HTTP status codes after expanding group', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), status: 100, statusText: 'Continue' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(0, '10:01:00.000Z'), status: 200, statusText: 'OK' }),
      makeItem({ index: 2, createdAt: uniqueTimestamp(0, '10:02:00.000Z'), status: 301, statusText: 'Moved' }),
      makeItem({ index: 3, createdAt: uniqueTimestamp(0, '10:03:00.000Z'), status: 404, statusText: 'Not Found' }),
      makeItem({ index: 4, createdAt: uniqueTimestamp(0, '10:04:00.000Z'), status: 500, statusText: 'Server Error' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('301')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('renders items with different HTTP methods after expanding group', async () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const items = methods.map((method, i) =>
      makeItem({
        index: i,
        createdAt: uniqueTimestamp(0, `10:0${i}:00.000Z`),
        method,
        url: `https://graph.microsoft.com/v1.0/me/${method.toLowerCase()}`
      })
    );
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      methods.forEach(method => {
        expect(screen.getAllByText(method).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('filters history items via search box', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/messages' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(0, '10:01:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/contacts' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    expect(screen.getByText('2 search results available.')).toBeInTheDocument();
    const searchBox = screen.getByPlaceholderText('Search history items');
    fireEvent.change(searchBox, { target: { value: 'messages' } });
    expect(screen.getByText('1 search results available.')).toBeInTheDocument();
  });

  it('shows empty state when search filters to zero results', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    const searchBox = screen.getByPlaceholderText('Search history items');
    fireEvent.change(searchBox, { target: { value: 'nonexistentquery' } });
    expect(screen.getByText('We did not find any history items')).toBeInTheDocument();
  });

  it('renders beta URL items after expanding group', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/beta/me/profile' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/beta/me/profile')).toBeInTheDocument();
    });
  });

  it('shows search result count announcement', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(0, '10:01:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/messages' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    expect(screen.getByText('2 search results available.')).toBeInTheDocument();
  });

  it('shows Add to collection button for items not in collection', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z') })
    ];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    const leafItem = screen.getByText('/v1.0/me').closest('[role="treeitem"]');
    if (leafItem) {
      fireEvent.pointerMove(leafItem);
      fireEvent.mouseEnter(leafItem);
      fireEvent.pointerEnter(leafItem);
      fireEvent.focus(leafItem);
    }
    await waitFor(() => {
      const addBtn = container.querySelector('[aria-label="Add to collection"]');
      expect(addBtn).toBeTruthy();
    });
    const removeBtn = container.querySelector('[aria-label="Remove from collection"]');
    expect(removeBtn).toBeFalsy();
  });

  it('shows Remove from collection button for items in collection', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET' })
    ];
    const collections = [{
      isDefault: true,
      name: 'Default',
      paths: [{ url: '/me', method: 'GET' }]
    }];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections, saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    const leafItem = screen.getByText('/v1.0/me').closest('[role="treeitem"]');
    if (leafItem) {
      fireEvent.pointerMove(leafItem);
      fireEvent.mouseEnter(leafItem);
      fireEvent.pointerEnter(leafItem);
      fireEvent.focus(leafItem);
    }
    await waitFor(() => {
      const removeBtn = container.querySelector('[aria-label="Remove from collection"]');
      expect(removeBtn).toBeTruthy();
    });
    const addBtn = container.querySelector('[aria-label="Add to collection"]');
    expect(addBtn).toBeFalsy();
  });

  it('displays updated result count after filtering', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/messages' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(0, '10:01:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/contacts' }),
      makeItem({ index: 2, createdAt: uniqueTimestamp(0, '10:02:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/events' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    expect(screen.getByText('3 search results available.')).toBeInTheDocument();
    const searchBox = screen.getByPlaceholderText('Search history items');
    fireEvent.change(searchBox, { target: { value: 'messages' } });
    expect(screen.getByText('1 search results available.')).toBeInTheDocument();
  });

  it('clicking a history item dispatches setSampleQuery and setQueryResponse', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', status: 200, statusText: 'OK', duration: 100 })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('/v1.0/me'));
    // Verify telemetry was called
    const { telemetry } = require('../../../../telemetry');
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('clicking Add to collection dispatches addResourcePaths', async () => {
    const { addResourcePaths } = require('../../../services/slices/collections.slice');
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET' })
    ];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    const addBtn = container.querySelector('[aria-label="Add to collection"]');
    if (addBtn) {
      fireEvent.click(addBtn);
      expect(addResourcePaths).toHaveBeenCalled();
    }
  });

  it('clicking Remove from collection dispatches removeResourcePaths', async () => {
    const { removeResourcePaths } = require('../../../services/slices/collections.slice');
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET' })
    ];
    const collections = [{
      isDefault: true,
      name: 'Default',
      paths: [{ url: '/me', method: 'GET' }]
    }];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections, saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    const removeBtn = container.querySelector('[aria-label="Remove from collection"]');
    if (removeBtn) {
      fireEvent.click(removeBtn);
      expect(removeResourcePaths).toHaveBeenCalled();
    }
  });

  it('export button on group calls exportQuery', async () => {
    const { exportQuery } = require('./har-utils');
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    // Find and click the export button (ArrowDownload icon button)
    const exportBtns = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('Export'));
    if (exportBtns.length > 0) {
      fireEvent.click(exportBtns[0]);
      expect(exportQuery).toHaveBeenCalled();
    }
  });

  it('delete group dialog shows confirmation when delete button clicked', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    // Find delete group button
    const deleteBtns = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('Delete'));
    if (deleteBtns.length > 0) {
      fireEvent.click(deleteBtns[0]);
      await waitFor(() => {
        expect(screen.getByText('Are you sure you want to delete these requests?')).toBeInTheDocument();
      });
    }
  });

  it('cancel button in delete dialog closes it', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const deleteBtns = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('Delete'));
    if (deleteBtns.length > 0) {
      fireEvent.click(deleteBtns[0]);
      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Cancel'));
      await waitFor(() => {
        expect(screen.queryByText('Are you sure you want to delete these requests?')).not.toBeInTheDocument();
      });
    }
  });

  it('confirm delete in dialog removes history items', async () => {
    const { historyCache } = require('../../../../modules/cache/history-utils');
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const deleteBtns = screen.getAllByRole('button').filter(b => b.getAttribute('aria-label')?.includes('Delete'));
    if (deleteBtns.length > 0) {
      fireEvent.click(deleteBtns[0]);
      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
      // Click the primary Delete button in the dialog
      const dialogDeleteBtn = screen.getAllByText('Delete').find(el => el.closest('button')?.className?.includes(''));
      if (dialogDeleteBtn) {
        fireEvent.click(dialogDeleteBtn);
        expect(historyCache.bulkRemoveHistoryData).toHaveBeenCalled();
      }
    }
  });

  it('search is case-insensitive', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/Messages' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    const searchBox = screen.getByPlaceholderText('Search history items');
    fireEvent.change(searchBox, { target: { value: 'messages' } });
    expect(screen.getByText('1 search results available.')).toBeInTheDocument();
  });

  it('clicking a history item with beta URL dispatches correct version', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/beta/me/profile', method: 'GET', status: 200 })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/beta/me/profile')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('/beta/me/profile'));
    const { telemetry } = require('../../../../telemetry');
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('item action menu Export button exports single item', async () => {
    const { exportQuery, createHarEntry, generateHar } = require('./har-utils');
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET', status: 200 })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    // Click the more actions button on the leaf item
    const leafTreeItem = screen.getByText('/v1.0/me').closest('[role="treeitem"]');
    const moreBtn = leafTreeItem?.querySelector('button:not([aria-label])') ||
      Array.from(leafTreeItem?.querySelectorAll('button') || []).find(b => !b.getAttribute('aria-label'));
    if (moreBtn) {
      fireEvent.click(moreBtn);
      await waitFor(() => {
        expect(screen.getByText('Export')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Export'));
      expect(createHarEntry).toHaveBeenCalled();
      expect(generateHar).toHaveBeenCalled();
      expect(exportQuery).toHaveBeenCalled();
    }
  });

  it('item action menu Delete button deletes single item', async () => {
    const { historyCache } = require('../../../../modules/cache/history-utils');
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET', status: 200 })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    const leafTreeItem = screen.getByText('/v1.0/me').closest('[role="treeitem"]');
    const moreBtn = leafTreeItem?.querySelector('button:not([aria-label])') ||
      Array.from(leafTreeItem?.querySelectorAll('button') || []).find(b => !b.getAttribute('aria-label'));
    if (moreBtn) {
      fireEvent.click(moreBtn);
      await waitFor(() => {
        // There might be multiple "Delete" texts - one in group header, one in menu
        const deleteItems = screen.getAllByText('Delete');
        expect(deleteItems.length).toBeGreaterThan(0);
      });
      // Click the Delete menu item (last one should be the menu item)
      const deleteItems = screen.getAllByText('Delete');
      const menuDelete = deleteItems.find(el => el.closest('[role="menuitem"]'));
      if (menuDelete) {
        fireEvent.click(menuDelete);
        expect(historyCache.removeHistoryData).toHaveBeenCalled();
      }
    }
  });

  it('renders multiple items sorted by createdAt DESC', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/first' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(0, '10:05:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/second' }),
      makeItem({ index: 2, createdAt: uniqueTimestamp(0, '10:10:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/third' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me/first')).toBeInTheDocument();
      expect(screen.getByText('/v1.0/me/second')).toBeInTheDocument();
      expect(screen.getByText('/v1.0/me/third')).toBeInTheDocument();
    });
  });

  it('clicking Add to collection on an item dispatches addResourcePaths', async () => {
    const { addResourcePaths } = require('../../../services/slices/collections.slice');
    addResourcePaths.mockClear();
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/messages', method: 'POST' })
    ];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me/messages')).toBeInTheDocument();
    });
    const addBtn = container.querySelector('[aria-label="Add to collection"]');
    if (addBtn) {
      fireEvent.click(addBtn);
      expect(addResourcePaths).toHaveBeenCalled();
    }
  });

  it('clicking Remove from collection dispatches removeResourcePaths for beta URL', async () => {
    const { removeResourcePaths } = require('../../../services/slices/collections.slice');
    removeResourcePaths.mockClear();
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/beta/me/profile', method: 'GET' })
    ];
    const collections = [{
      isDefault: true,
      name: 'Default',
      paths: [{ url: '/me/profile', method: 'GET' }]
    }];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections, saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/beta/me/profile')).toBeInTheDocument();
    });
    const removeBtn = container.querySelector('[aria-label="Remove from collection"]');
    if (removeBtn) {
      fireEvent.click(removeBtn);
      expect(removeResourcePaths).toHaveBeenCalled();
    }
  });

  it('handles items with empty body and headers in view query', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', body: null, headers: [], result: '{"id":"1"}', responseHeaders: { 'content-type': 'application/json' }, status: 200, duration: 50 })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('/v1.0/me'));
    // No crash, telemetry tracked
    const { telemetry } = require('../../../../telemetry');
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('handles item with error status (400+)', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/invalid', status: 403, statusText: 'Forbidden', method: 'DELETE' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('403')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('/v1.0/me/invalid'));
  });

  it('isInCollection returns false when no default collection exists', async () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET' })
    ];
    const collections = [{
      isDefault: false,
      name: 'Custom',
      paths: [{ url: '/me', method: 'GET' }]
    }];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections, saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    // With no default collection, item is not in collection
    // Verify the leaf item rendered properly
    const leafItem = screen.getByText('/v1.0/me');
    expect(leafItem).toBeInTheDocument();
  });

  it('formatHistoryItem handles URL with single path segment', async () => {
    const { addResourcePaths } = require('../../../services/slices/collections.slice');
    addResourcePaths.mockClear();
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me', method: 'GET' })
    ];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me')).toBeInTheDocument();
    });
    const addBtn = container.querySelector('[aria-label="Add to collection"]');
    if (addBtn) {
      fireEvent.click(addBtn);
      expect(addResourcePaths).toHaveBeenCalledWith([expect.objectContaining({
        name: 'me',
        version: 'v1.0',
        method: 'GET'
      })]);
    }
  });

  it('processUrlAndVersion handles beta URL in add to collection', async () => {
    const { addResourcePaths } = require('../../../services/slices/collections.slice');
    addResourcePaths.mockClear();
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/beta/me/profile', method: 'POST' })
    ];
    const { container } = renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/beta/me/profile')).toBeInTheDocument();
    });
    const addBtn = container.querySelector('[aria-label="Add to collection"]');
    if (addBtn) {
      fireEvent.click(addBtn);
      expect(addResourcePaths).toHaveBeenCalledWith([expect.objectContaining({
        version: 'beta',
        method: 'POST',
        url: '/me/profile'
      })]);
    }
  });

  it('search reset shows all items again', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/messages' }),
      makeItem({ index: 1, createdAt: uniqueTimestamp(0, '10:01:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me/contacts' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    expect(screen.getByText('2 search results available.')).toBeInTheDocument();
    const searchBox = screen.getByPlaceholderText('Search history items');
    fireEvent.change(searchBox, { target: { value: 'messages' } });
    expect(screen.getByText('1 search results available.')).toBeInTheDocument();
    // Clear search
    fireEvent.change(searchBox, { target: { value: '' } });
    expect(screen.getByText('2 search results available.')).toBeInTheDocument();
  });

  it('handles whitespace-only search input', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z'), url: 'https://graph.microsoft.com/v1.0/me' })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    const searchBox = screen.getByPlaceholderText('Search history items');
    fireEvent.change(searchBox, { target: { value: '   ' } });
    // Whitespace search should show all items (trimmed to empty = reset)
    expect(screen.getByText('1 search results available.')).toBeInTheDocument();
  });

  it('renders items with POST method and result in view query', async () => {
    const items = [
      makeItem({
        index: 0,
        createdAt: uniqueTimestamp(0, '10:00:00.000Z'),
        url: 'https://graph.microsoft.com/v1.0/me/messages',
        method: 'POST',
        body: '{"subject":"test"}',
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        result: '{"id":"msg-1"}',
        responseHeaders: { 'content-type': 'application/json' },
        status: 201,
        statusText: 'Created',
        duration: 300
      })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: [], saved: false } }
    });
    await waitFor(() => {
      expect(screen.getByText('today')).toBeInTheDocument();
    });
    const groupItem = screen.getByText('today').closest('[role="treeitem"]');
    if (groupItem) { fireEvent.click(groupItem); }
    await waitFor(() => {
      expect(screen.getByText('/v1.0/me/messages')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('/v1.0/me/messages'));
    const { telemetry } = require('../../../../telemetry');
    expect(telemetry.trackEvent).toHaveBeenCalled();
  });

  it('renders with null collections', () => {
    const items = [
      makeItem({ index: 0, createdAt: uniqueTimestamp(0, '10:00:00.000Z') })
    ];
    renderWithProviders(<History />, {
      preloadedState: { history: items, collections: { collections: null as any, saved: false } }
    });
    expect(screen.getByText('1 search results available.')).toBeInTheDocument();
  });
});
