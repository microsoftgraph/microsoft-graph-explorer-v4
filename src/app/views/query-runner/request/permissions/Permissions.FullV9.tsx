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
  Badge,
  makeStyles,
  Divider,
  Input,
  createTableColumn,
  TableColumnDefinition
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { IPermission } from '../../../../../types/permissions';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { translateMessage } from '../../../../utils/translate-messages';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    width: '100%',
    overflowX: 'auto' // Allow horizontal scrolling
  },
  searchBar: {
    width: '300px'
  },
  groupHeader: {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0'
  }
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
    if (tokenPresent) {
      dispatch(fetchAllPrincipalGrants());
    }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleOpenChange = (group: string) => {
    const updatedOpenItems = new Set(openItems);
    if (updatedOpenItems.has(group)) {
      updatedOpenItems.delete(group);
    } else {
      updatedOpenItems.add(group);
    }
    setOpenItems(updatedOpenItems);
  };

  const columns: TableColumnDefinition<IPermission>[] = [
    createTableColumn<IPermission>({
      columnId: 'value',
      renderHeaderCell: () => translateMessage('Permission'),
      renderCell: (item) => item.value
    }),
    createTableColumn<IPermission>({
      columnId: 'isAdmin',
      renderHeaderCell: () => translateMessage('Admin Consent'),
      renderCell: (item) =>
        item.isAdmin ? translateMessage('Yes') : translateMessage('No')
    }),
    createTableColumn<IPermission>({
      columnId: 'consented',
      renderHeaderCell: () => translateMessage('Status'),
      renderCell: (item) =>
        item.consented
          ? translateMessage('Consented')
          : translateMessage('Not Consented')
    }),
    createTableColumn<IPermission>({
      columnId: 'consentType',
      renderHeaderCell: () => translateMessage('Consent Type'),
      renderCell: (item) => item.consentType
    })
  ];

  return (
    <div className={styles.container}>
      <div>
        <Input
          className={styles.searchBar}
          placeholder={translateMessage('Search permissions')}
          onChange={handleSearchChange}
          value={searchValue}
        />
      </div>
      <Divider />
      <FlatTree aria-label={translateMessage('Permissions')}>
        {Object.entries(groupedPermissions).map(([group, items]) => (
          <FlatTreeItem
            key={group}
            value={group}
            itemType="branch"
            aria-label={`${group} group`} aria-level={0} aria-posinset={0} aria-setsize={0}          >
            <TreeItemLayout
              onClick={() => handleOpenChange(group)}
              aside={
                <Badge appearance="tint" color="informative">
                  {items.length}
                </Badge>
              }
              className={styles.groupHeader}
            >
              {group}
            </TreeItemLayout>
            {openItems.has(group) && (
              <DataGrid
                as="div"
                aria-label={`${group} permissions`}
                columns={columns}
                items={items}
                getRowId={(item) => item.value}
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
                  {() =>
                    items.map((item) => (
                      <DataGridRow key={item.value}>
                        {(column) => (
                          <DataGridCell key={column.columnId}>
                            {column.renderCell(item)}
                          </DataGridCell>
                        )}
                      </DataGridRow>
                    ))
                  }
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
