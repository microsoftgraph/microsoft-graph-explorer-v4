import {
  Tree,
  TreeItem,
  TreeItemLayout,
  Label,
  Input,
  makeStyles,
  Spinner,
  Button,
  Divider
} from '@fluentui/react-components';
import { Filter24Regular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { translateMessage } from '../../../../utils/translate-messages';
import PermissionItem from './PermissionItem';
import { getColumns } from './columnsV9';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchBar: {
    width: '300px'
  },
  treeWrapper: {
    padding: '8px',
    border: '1px solid #e1e1e1',
    borderRadius: '8px',
    overflowY: 'auto',
    maxHeight: '500px'
  },
  treeItemLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '1rem',
    alignItems: 'center'
  }
});

type Filter = 'all-permissions' | 'consented-permissions' | 'unconsented-permissions';

const FullPermissions = (): JSX.Element => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { scopes, auth: { consentedScopes, authToken } } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!authToken.token;
  const loading = scopes.pending.isFullPermissions;

  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all-permissions');

  useEffect(() => {
    dispatch(fetchScopes('full'));
    if (tokenPresent) {
      dispatch(fetchAllPrincipalGrants());
    }
  }, [dispatch, tokenPresent]);

  useEffect(() => {
    if (!searchValue) {
      setPermissions(fullPermissions);
    }
  }, [fullPermissions, searchValue]);

  const filteredPermissions = permissions.filter((permission) => {
    if (filter === 'consented-permissions') {return permission.consented;}
    if (filter === 'unconsented-permissions') {return !permission.consented;}
    return true;
  });

  const sortedPermissions = [...filteredPermissions].sort(
    dynamicSort<IPermission>('value', SortOrder.ASC)
  );

  const groupedPermissions = sortedPermissions.reduce((acc, permission) => {
    const group = permission.value.split('.')[0];
    if (!acc[group]) {acc[group] = [];}
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, IPermission[]>);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
    const results = fullPermissions.filter((permission) =>
      permission.value.toLowerCase().includes(value)
    );
    setPermissions(results);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <Spinner label={translateMessage('Fetching permissions')} />
      ) : (
        <>
          <div className={styles.header}>
            <Label>{translateMessage('Permissions')}</Label>
            <Input
              className={styles.searchBar}
              placeholder={translateMessage('Search permissions')}
              onChange={handleSearchChange}
              value={searchValue}
            />
          </div>
          <Divider />
          <div className={styles.treeWrapper}>
            <Tree>
              {Object.entries(groupedPermissions).map(([group, permissions]) => (
                <TreeItem key={group} value={group} itemType={'branch'}>
                  <TreeItemLayout>{group} ({permissions.length})</TreeItemLayout>
                  {permissions.map((permission, index) => (
                    <TreeItem key={permission.value} value={permission.value} itemType={'leaf'}>
                      <PermissionItem
                        item={permission}
                        index={index}
                        column={{
                          key: 'value',
                          name: 'value',
                          minWidth: 100,
                          ...getColumns({ source: 'panel', tokenPresent })[0]
                        }}
                      />
                    </TreeItem>
                  ))}
                </TreeItem>
              ))}
            </Tree>
          </div>
        </>
      )}
    </div>
  );
};

export default FullPermissions;