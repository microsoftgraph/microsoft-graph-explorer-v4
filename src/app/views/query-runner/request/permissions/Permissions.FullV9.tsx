import {
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  Badge,
  makeStyles,
  Text,
  Divider,
  Input
} from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { translateMessage } from '../../../../utils/translate-messages';
import PermissionItem from './PermissionItemV9';

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
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '1rem',
    padding: '8px',
    fontWeight: 'bold',
    backgroundColor: '#f3f3f3',
    borderBottom: '1px solid #e1e1e1'
  },
  treeItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr',
    gap: '1rem',
    alignItems: 'center',
    padding: '8px',
    borderBottom: '1px solid #e1e1e1'
  },
  searchBar: {
    width: '300px'
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
      <div className={styles.header}>
        <span>{translateMessage('Permission')}</span>
        <span>{translateMessage('Admin Consent')}</span>
        <span>{translateMessage('Status')}</span>
        <span>{translateMessage('Description')}</span>
      </div>
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
            >
              {group}
            </TreeItemLayout>
            {openItems.has(group) &&
              items.map((item, index) => (
                <FlatTreeItem
                  key={item.value}
                  parentValue={group}
                  value={item.value}
                  itemType="leaf"
                  aria-label={`${item.value} permission`} aria-level={0}
                  aria-posinset={0} aria-setsize={0}>
                  <TreeItemLayout >
                    <PermissionItem
                      key={item.value}
                      item={item}
                      index={index}
                      column={{ key: 'value', fieldName: 'value' }}
                    />
                    <PermissionItem
                      key={`${item.value}-admin`}
                      item={item}
                      index={index}
                      column={{ key: 'isAdmin', fieldName: 'isAdmin' }}
                    />
                    <PermissionItem
                      key={`${item.value}-status`}
                      item={item}
                      index={index}
                      column={{ key: 'consented', fieldName: 'consented' }}
                    />
                    <PermissionItem
                      key={`${item.value}-consentType`}
                      item={item}
                      index={index}
                      column={{ key: 'consentType', fieldName: 'consentType' }}
                    />
                  </TreeItemLayout>
                </FlatTreeItem>
              ))}
          </FlatTreeItem>
        ))}
      </FlatTree>
    </div>
  );
};

export default FullPermissionsV9;
