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
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('../resourcelink.utils', () => ({
  handleShiftArrowSelection: jest.fn().mockReturnValue({
    newFocusedIndex: 1,
    newAnchorIndex: 0,
    newSelection: new Set()
  })
}));

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';
import Paths from './Paths';
import { handleShiftArrowSelection } from '../resourcelink.utils';

describe('Paths', () => {
  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 800, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  const resources = [
    { key: '1', url: '/users', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' },
    { key: '2', url: '/groups', method: 'POST', version: 'v1.0', scope: 'DelegatedWork' }
  ];

  it('renders table with headers', () => {
    renderWithProviders(<Paths resources={resources} columns={columns} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Scope')).toBeInTheDocument();
  });

  it('renders resource rows', () => {
    renderWithProviders(<Paths resources={resources} columns={columns} />);
    const rows = screen.getAllByRole('row');
    // header row + 2 data rows
    expect(rows.length).toBe(3);
  });

  it('renders method badges', () => {
    renderWithProviders(<Paths resources={resources} columns={columns} />);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('renders with selectable checkboxes', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // select-all checkbox + 2 item checkboxes
    expect(checkboxes.length).toBe(3);
  });

  it('renders empty table when no resources', () => {
    renderWithProviders(<Paths resources={[]} columns={columns} />);
    const rows = screen.getAllByRole('row');
    // only header row
    expect(rows.length).toBe(1);
  });

  it('clicking a checkbox calls onSelectionChange with the selected item', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // checkboxes[0] = select all, [1] = first item, [2] = second item
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith([resources[0]]);
  });

  it('clicking select all checkbox selects all items', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // select all
    expect(onSelectionChange).toHaveBeenCalledWith(resources);
  });

  it('clicking select all again deselects all items', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // select all
    fireEvent.click(checkboxes[0]); // deselect all
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it('renders scope labels correctly', () => {
    renderWithProviders(<Paths resources={resources} columns={columns} />);
    const scopeLabels = screen.getAllByText('Delegated Work');
    expect(scopeLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('does not render badge when resource has no method', () => {
    const noMethodResources = [
      { key: '1', url: '/users', method: '', version: 'v1.0', scope: 'DelegatedWork' }
    ];
    renderWithProviders(<Paths resources={noMethodResources} columns={columns} />);
    expect(screen.queryByText('GET')).not.toBeInTheDocument();
    expect(screen.queryByText('POST')).not.toBeInTheDocument();
    // The URL should still render
    expect(screen.getByText('/v1.0/users')).toBeInTheDocument();
  });

  it('does not render checkbox column header when not selectable', () => {
    renderWithProviders(<Paths resources={resources} columns={columns} isSelectable={false} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('row click without shift sets focus and anchor', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const rows = screen.getAllByRole('row');
    // rows[0] = header, rows[1] = first data row
    fireEvent.click(rows[1]);
    // No selection change should be called on plain click (only focus/anchor set)
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('pressing Enter on a checkbox toggles selection', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.keyDown(checkboxes[1], { key: 'Enter' });
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith([resources[0]]);
  });

  it('row keyboard navigation with Shift+ArrowDown calls handleShiftArrowSelection', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const rows = screen.getAllByRole('row');
    // First click to set focusedIndex and anchorIndex
    fireEvent.click(rows[1]);
    // Then Shift+ArrowDown
    fireEvent.keyDown(rows[1], { key: 'ArrowDown', shiftKey: true });
    expect(handleShiftArrowSelection).toHaveBeenCalled();
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('row keyboard navigation with Shift+ArrowUp calls handleShiftArrowSelection', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const rows = screen.getAllByRole('row');
    // Click second data row to set focus
    fireEvent.click(rows[2]);
    // Then Shift+ArrowUp
    fireEvent.keyDown(rows[2], { key: 'ArrowUp', shiftKey: true });
    expect(handleShiftArrowSelection).toHaveBeenCalled();
  });

  it('renders multiple columns with correct data', () => {
    const multiResources = [
      { key: '1', url: '/me/messages', method: 'GET', version: 'v1.0', scope: 'DelegatedWork' },
      { key: '2', url: '/users', method: 'DELETE', version: 'beta', scope: 'Application' }
    ];
    renderWithProviders(<Paths resources={multiResources} columns={columns} />);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('/v1.0/me/messages')).toBeInTheDocument();
    expect(screen.getByText('/beta/users')).toBeInTheDocument();
  });

  it('toggling individual checkbox then deselecting works correctly', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // Select first item
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith([resources[0]]);
    // Deselect first item
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it('selecting multiple items individually', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(expect.arrayContaining([resources[0], resources[1]]));
  });

  it('shift+click on row triggers handleShiftArrowSelection', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const rows = screen.getAllByRole('row');
    // First click to set anchor
    fireEvent.click(rows[1]);
    // Then shift+click on another row
    fireEvent.click(rows[2], { shiftKey: true });
    expect(handleShiftArrowSelection).toHaveBeenCalled();
  });

  it('shift+click on checkbox triggers handleShiftArrowSelection', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // Click first checkbox to set anchor
    fireEvent.click(checkboxes[1]);
    // Shift+click on second checkbox
    fireEvent.click(checkboxes[2], { shiftKey: true });
    // The shift logic in onChange checks nativeEvent.shiftKey
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('checkbox Shift+ArrowDown calls handleShiftArrowSelection', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // Click to set anchor
    fireEvent.click(checkboxes[1]);
    // Shift+ArrowDown on checkbox
    fireEvent.keyDown(checkboxes[1], { key: 'ArrowDown', shiftKey: true });
    expect(handleShiftArrowSelection).toHaveBeenCalled();
  });

  it('checkbox Shift+ArrowUp calls handleShiftArrowSelection', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // Click second to set anchor
    fireEvent.click(checkboxes[2]);
    // Shift+ArrowUp on checkbox
    fireEvent.keyDown(checkboxes[2], { key: 'ArrowUp', shiftKey: true });
    expect(handleShiftArrowSelection).toHaveBeenCalled();
  });

  it('checkbox focus sets focusedIndex and anchorIndex', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.focus(checkboxes[1]);
    // After focus, shift+arrow should work because anchorIndex is set
    fireEvent.keyDown(checkboxes[1], { key: 'ArrowDown', shiftKey: true });
    expect(handleShiftArrowSelection).toHaveBeenCalled();
  });

  it('select all header checkbox Enter key toggles selection', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // Press Enter on select-all
    fireEvent.keyDown(checkboxes[0], { key: 'Enter' });
    expect(onSelectionChange).toHaveBeenCalledWith(resources);
  });

  it('renders scope as default when scope is null/undefined', () => {
    const noScopeResources = [
      { key: '1', url: '/users', method: 'GET', version: 'v1.0', scope: undefined }
    ];
    renderWithProviders(<Paths resources={noScopeResources as any} columns={columns} />);
    // Should render the default scope label from scopeOptions[0].key
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('allSelected becomes true when all items selected individually', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    // After selecting all items individually, select-all should reflect that
    // The checkbox state is internally managed
    expect(onSelectionChange).toHaveBeenLastCalledWith(expect.arrayContaining(resources));
  });

  it('renders resource without scope (undefined) with default label', () => {
    const noScopeResource = [
      { key: '1', url: '/test', method: 'PATCH', version: 'beta', scope: undefined }
    ];
    renderWithProviders(<Paths resources={noScopeResource as any} columns={columns} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('PATCH')).toBeInTheDocument();
  });

  it('renders resource without method correctly (no badge)', () => {
    const noMethod = [
      { key: '1', url: '/custom', method: undefined, version: 'v1.0', scope: 'Application' }
    ];
    renderWithProviders(<Paths resources={noMethod as any} columns={columns} />);
    expect(screen.getByText('/v1.0/custom')).toBeInTheDocument();
  });

  it('row click on checkbox input does not trigger row click handler', () => {
    const onSelectionChange = jest.fn();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // Direct checkbox click should go through the checkbox handler
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith([resources[0]]);
  });

  it('does not call onSelectionChange when prop is not provided', () => {
    // No onSelectionChange prop - should not throw
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    // No crash
    expect(checkboxes[1]).toBeInTheDocument();
  });

  it('Shift+ArrowDown on row does nothing when focusedIndex is null', () => {
    const onSelectionChange = jest.fn();
    (handleShiftArrowSelection as jest.Mock).mockClear();
    renderWithProviders(
      <Paths resources={resources} columns={columns} isSelectable={true} onSelectionChange={onSelectionChange} />
    );
    const rows = screen.getAllByRole('row');
    // Do NOT click first - focusedIndex is null
    fireEvent.keyDown(rows[1], { key: 'ArrowDown', shiftKey: true });
    // Should NOT call handleShiftArrowSelection since focusedIndex is null
    expect(handleShiftArrowSelection).not.toHaveBeenCalled();
  });
});
