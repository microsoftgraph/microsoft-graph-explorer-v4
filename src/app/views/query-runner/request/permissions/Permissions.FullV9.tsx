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
  makeStyles
} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columnsV9';
import { IPermission } from '../../../../../types/permissions';

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' },
  searchBar: { width: '300px' },
  groupHeader: { fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }
});

const FullPermissionsV9 = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { scopes, auth } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!auth.authToken.token;

  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchScopes('full'));
    if (tokenPresent) {dispatch(fetchAllPrincipalGrants());}
  }, [dispatch, tokenPresent]);

  useEffect(() => {
    setPermissions(fullPermissions);
  }, [fullPermissions]);

  const filteredPermissions = permissions.filter((permission) =>
    permission.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const group = permission.value.split('.')[0];
    if (!acc[group]) {acc[group] = [];}
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, IPermission[]>);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const handleOpenChange = (group: string) => {
    const updatedOpenItems = new Set(openItems);
    if (updatedOpenItems.has(group)) {updatedOpenItems.delete(group);}
    else {updatedOpenItems.add(group);}
    setOpenItems(updatedOpenItems);
  };

  const columns = getColumns({ source: 'panel', tokenPresent });

  return (
    <div className={styles.container}>
      <Input
        className={styles.searchBar}
        placeholder={translateMessage('Search permissions')}
        onChange={handleSearchChange}
        value={searchValue}
      />
      <FlatTree aria-label={translateMessage('Permissions')}>
        {Object.entries(groupedPermissions).map(([group, items]) => (
          <FlatTreeItem key={group} value={group} itemType="branch" aria-level={0} aria-posinset={0} aria-setsize={0}>
            <TreeItemLayout
              onClick={() => handleOpenChange(group)}
              aside={<Badge appearance="tint">{items.length}</Badge>}
              className={styles.groupHeader}
            >
              {group}
            </TreeItemLayout>
            {openItems.has(group) && (
              <DataGrid
                columns={columns}
                items={items.map((item, index) => {
                  return { item, index };
                })}
                getRowId={(row: { item: IPermission; index: number }) => row.item.value}
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
                  {({ item }: { item: { item: IPermission; index: number } }) => (
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