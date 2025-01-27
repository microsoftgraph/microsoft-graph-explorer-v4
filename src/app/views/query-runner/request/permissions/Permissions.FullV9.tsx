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
  Badge,
  makeStyles,
  CounterBadge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger
} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columnsV9';
import { IPermission } from '../../../../../types/permissions';
import { Filter24Regular } from '@fluentui/react-icons';

type Filter = 'all-permissions' | 'consented-permissions' | 'unconsented-permissions';
interface PermissionListItem extends IPermission {
  groupName?: string;
}

const setConsentedStatus = (
  tokenPresent: boolean,
  permissions: IPermission[],
  consentedScopes: string[]
): IPermission[] => {
  return permissions.map((permission) => ({
    ...permission,
    consented: tokenPresent && consentedScopes.includes(permission.value)
  }));
};

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' },
  controlsRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  searchBar: { width: '300px' },
  groupHeader: { display: 'flex', justifyContent: 'space-between' }
});

const FullPermissionsV9 = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { scopes, auth } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!auth.authToken.token;

  const [permissions, setPermissions] = useState<PermissionListItem[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>('all-permissions');

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
      return searchedPermissions.filter((p) => p.consented);
    case 'unconsented-permissions':
      return searchedPermissions.filter((p) => !p.consented);
    default:
      return searchedPermissions;
    }
  })();

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const group = permission.groupName ?? 'Unknown';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, PermissionListItem[]>);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const handleOpenChange = (group: string) => {
    const updatedOpenItems = new Set(openItems);
    if (updatedOpenItems.has(group)) {
      updatedOpenItems.delete(group);
    } else {
      updatedOpenItems.add(group);
    }
    setOpenItems(updatedOpenItems);
  };

  const chooseFilter = (chosenFilter: Filter) => {
    setFilter(chosenFilter);
  };

  const columns = getColumns({ source: 'panel', tokenPresent });

  return (
    <div className={styles.container}>
      <div className={styles.controlsRow}>
        <Menu>
          <MenuTrigger>
            <MenuButton
              icon={<Filter24Regular />}
              appearance='primary' // or 'subtle', etc.
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
      <FlatTree aria-label={translateMessage('Permissions')}>
        {Object.entries(groupedPermissions).map(([group, items], index) => (
          <FlatTreeItem key={group} value={group} itemType='branch'
            aria-level={1}
            aria-posinset={index + 1}
            aria-setsize={Object.keys(groupedPermissions).length}>
            <TreeItemLayout
              onClick={() => handleOpenChange(group)}
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
            {openItems.has(group) && (
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
                  {({ item }: { item: { item: PermissionListItem; index: number } }) => (
                    <DataGridRow key={item.item.value}>
                      {(column) => (
                        <DataGridCell key={column.columnId}>
                          {column.renderCell({ item: item.item, index: item.index })}
                        </DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            )}
          </FlatTreeItem>
        ))}
      </FlatTree>
    </div>
  );
};

export default FullPermissionsV9;
