import React, { useEffect, useState } from 'react';
import {
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  Input,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  CounterBadge,
  Text,
  TableColumnId,
  DataGridCellFocusMode
} from '@fluentui/react-components';
import {
  Filter24Regular
} from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columns';
import { IPermission } from '../../../../../types/permissions';
import { setConsentedStatus } from './util';
import permissionStyles from './Permission.styles';

type Filter = 'all-permissions' | 'consented-permissions' | 'unconsented-permissions';

interface PermissionListItem extends IPermission {
  groupName?: string;
}

const FullPermissions = () => {
  const styles = permissionStyles();
  const dispatch = useAppDispatch();
  const scopes = useAppSelector((state) => state.scopes);
  const auth = useAppSelector((state) => state.auth);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!auth.authToken.token;
  const loading = scopes.pending.isFullPermissions;

  const [permissions, setPermissions] = useState<PermissionListItem[]>([]);

  const [filter, setFilter] = useState<Filter>('all-permissions');
  const [searchValue, setSearchValue] = useState('');

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchScopes('full'));
    if (tokenPresent) {
      dispatch(fetchAllPrincipalGrants());
    }
  }, [dispatch, tokenPresent]);

  useEffect(() => {
    const sortedPermissions = [...fullPermissions].sort((a, b) => a.value.localeCompare(b.value));
    const updatedPermissions = setConsentedStatus(tokenPresent, sortedPermissions, auth.consentedScopes);
    const permissionsList: PermissionListItem[] = updatedPermissions.map((perm) => ({
      ...perm,
      groupName: perm.value.split('.')[0]
    }));

    setPermissions(permissionsList);
  }, [fullPermissions, tokenPresent, auth.consentedScopes]);

  const searchedPermissions = permissions.filter((permission) =>
    permission.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredPermissions = (() => {
    switch (filter) {
    case 'consented-permissions':
      return searchedPermissions.filter((perm) => perm.consented);
    case 'unconsented-permissions':
      return searchedPermissions.filter((perm) => !perm.consented);
    default:
      return searchedPermissions;
    }
  })();

  const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
    const group = perm.groupName ?? 'Unknown';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, PermissionListItem[]>);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const chooseFilter = (chosenFilter: Filter) => {
    setFilter(chosenFilter);
  };

  const handleOpenChange = (
    _event: React.MouseEvent | React.KeyboardEvent,
    data: { value: string | number; open: boolean }
  ) => {
    const group = data.value as string;
    const updated = new Set(openItems);
    if (data.open) {
      updated.add(group);
    } else {
      updated.delete(group);
    }
    setOpenItems(updated);
  };

  const columns = getColumns({ source: 'panel', tokenPresent });

  const columnSizingOptions = {
    value: { minWidth: 250, defaultWidth: 300 },
    isAdmin: { minWidth: 150, defaultWidth: 170 },
    consentType: { minWidth: 100, defaultWidth: 150 }
  };

  const getCellFocusMode = (columnId: TableColumnId): DataGridCellFocusMode =>
    columnId === 'consented' ? 'none' : 'cell';

  return (
    <div className={styles.permissionContainer}>
      {loading ?
        <Text>
          {translateMessage('Fetching permissions')}...
        </Text> :
        <>
          <Text>
            {translateMessage('Select different permissions')}
          </Text>
          <div className={styles.controlsRow}>
            <Menu>
              <MenuTrigger>
                <MenuButton
                  icon={<Filter24Regular />}
                  appearance='primary'
                  disabled={loading || fullPermissions.length === 0}
                >
                  {translateMessage('Filter')}
                </MenuButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => chooseFilter('all-permissions')}>
                    {translateMessage('All permissions')}
                  </MenuItem>
                  <MenuItem onClick={() => chooseFilter('consented-permissions')}>
                    {translateMessage('Consented permissions')}
                  </MenuItem>
                  <MenuItem onClick={() => chooseFilter('unconsented-permissions')}>
                    {translateMessage('Unconsented permissions')}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>

            <Input
              className={styles.searchBar}
              placeholder={translateMessage('Search permissions')}
              onChange={handleSearchChange}
              value={searchValue}
            />
          </div>

          <FlatTree
            aria-label={translateMessage('Permissions')}
            openItems={Array.from(openItems)}
            onOpenChange={handleOpenChange}
          >
            {Object.entries(groupedPermissions).map(([group, items], groupIndex) => {
              const isOpen = openItems.has(group);

              return (
                <FlatTreeItem
                  key={group}
                  value={group}
                  itemType='branch'
                  aria-level={1}
                  aria-posinset={groupIndex + 1}
                  aria-setsize={Object.keys(groupedPermissions).length}
                >
                  <TreeItemLayout
                    aside={
                      <CounterBadge
                        appearance='filled'
                        color='informative'
                        shape='circular'
                        size='medium'
                        count={items.length}
                        aria-label={`${items.length} ${translateMessage('Permissions')}`}
                      />
                    }
                  >
                    {group}
                  </TreeItemLayout>

                  {isOpen && (
                    <DataGrid
                      columns={columns}
                      items={items.map((item, index) => ({ item, index }))}
                      getRowId={(row: { item: PermissionListItem; index: number }) => row.item.value}
                      resizableColumns={true}
                      columnSizingOptions={columnSizingOptions}
                    >
                      <DataGridHeader>
                        <DataGridRow>
                          {(column) => (
                            <DataGridHeaderCell
                              key={column.columnId}
                              style={{
                                justifyContent: column.columnId === 'consented' || column.columnId === 'consentType'
                                  ? 'center'
                                  : 'left',
                                maxWidth: '100%'}}
                            >
                              {column.renderHeaderCell()}
                            </DataGridHeaderCell>
                          )}
                        </DataGridRow>
                      </DataGridHeader>
                      <DataGridBody>
                        {({ item: rowData }: { item: { item: PermissionListItem; index: number } }) => (
                          <DataGridRow key={rowData.item.value}>
                            {(column) => (
                              <DataGridCell
                                key={column.columnId}
                                style={{
                                  justifyContent: column.columnId === 'isAdmin' ? 'center' : 'left',
                                  whiteSpace: 'nowrap'
                                }}
                                focusMode={getCellFocusMode(column.columnId)}
                              >
                                {column.renderCell({ item: rowData.item, index: rowData.index })}
                              </DataGridCell>
                            )}
                          </DataGridRow>
                        )}
                      </DataGridBody>
                    </DataGrid>
                  )}
                </FlatTreeItem>
              );
            })}
          </FlatTree>
        </>}

      {!loading && permissions && permissions.length === 0 && scopes?.error &&
                scopes?.error?.status && scopes?.error?.status === 404 ?
        <Text style={{
          display: 'flex',
          width: '100%',
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {translateMessage('permissions not found')}
        </Text> :
        !loading && permissions && permissions.length === 0 && scopes.error &&
                <Text>
                  {translateMessage('Fetching permissions failing')}
                </Text>
      }
    </div>
  );
};

export default FullPermissions;
