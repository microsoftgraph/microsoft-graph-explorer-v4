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
  makeStyles
} from '@fluentui/react-components';
import {
  Filter24Regular
} from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columnsV9';
import { IPermission } from '../../../../../types/permissions';
import { setConsentedStatus } from './util';

type Filter = 'all-permissions' | 'consented-permissions' | 'unconsented-permissions';

interface PermissionListItem extends IPermission {
  groupName?: string;
}

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' },
  controlsRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  searchBar: { width: '300px' }
});

const FullPermissionsV9 = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { scopes, auth } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!auth.authToken.token;

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

  return (
    <div className={styles.container}>
      <div className={styles.controlsRow}>
        <Menu>
          <MenuTrigger>
            <MenuButton
              icon={<Filter24Regular />}
              appearance='primary'
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
                    shape='rounded'
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
                >
                  <DataGridHeader>
                    <DataGridRow>
                      {(column) => (
                        <DataGridHeaderCell key={column.columnId}>
                          {column.renderHeaderCell()}
                        </DataGridHeaderCell>
                      )}
                    </DataGridRow>
                  </DataGridHeader>
                  <DataGridBody>
                    {({ item: rowData }: { item: { item: PermissionListItem; index: number } }) => (
                      <DataGridRow key={rowData.item.value}>
                        {(column) => (
                          <DataGridCell key={column.columnId}>
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
    </div>
  );
};

export default FullPermissionsV9;
