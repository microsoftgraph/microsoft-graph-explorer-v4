import {
  Table, TableHeader, TableRow, TableCell, TableBody,
  Link, Text, Label
} from '@fluentui/react-components';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { IPermission } from '../../../../../types/permissions';
import { ValidationContext } from '../../../../services/context/validation-context/ValidationContext';
import { usePopups } from '../../../../services/hooks';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { ScopesError } from '../../../../utils/error-utils/ScopesError';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columns';
import { setConsentedStatus, sortPermissionsWithPrivilege } from './util';
import permissionStyles  from './Permission.styles';


export const Permissions = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const scopes = useAppSelector((state) => state.scopes);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const consentedScopes = useAppSelector((state) => state.auth.consentedScopes);
  const { show: showPermissions } = usePopups('full-permissions', 'panel');

  const tokenPresent = !!authToken.token;
  const { pending: loading, error } = scopes;
  const [permissions, setPermissions] = useState<{ item: IPermission; index: number }[]>([]);
  const [permissionsError, setPermissionsError] = useState<ScopesError | null>(error);

  const styles = permissionStyles();

  useEffect(() => {
    if (error && error?.url.includes('permissions')) {
      setPermissionsError(error);
    }
  }, [error]);

  const openPermissionsPanel = () => {
    showPermissions({
      settings: {
        title: translateMessage('Permissions'),
        width: 'lg'
      }
    });
  };

  const getPermissions = (): void => {
    dispatch(fetchScopes('query'));
    fetchPermissionGrants();
  };

  const fetchPermissionGrants = (): void => {
    if (tokenPresent) {
      dispatch(fetchAllPrincipalGrants());
    }
  };

  useEffect(() => {
    if (validation.isValid) {
      getPermissions();
    }
  }, [sampleQuery]);

  useEffect(() => {
    if (tokenPresent && validation.isValid) {
      dispatch(fetchAllPrincipalGrants());
    }
  }, []);

  useEffect(() => {
    const specific = scopes.data?.specificPermissions ?? [];
    let updatedPermissions = sortPermissionsWithPrivilege(specific);
    updatedPermissions = setConsentedStatus(tokenPresent, updatedPermissions, consentedScopes);
    setPermissions(updatedPermissions.map((item, index) => ({ item, index })));
  }, [scopes.data.specificPermissions, tokenPresent, consentedScopes]);

  const columns = getColumns({ source: 'tab', tokenPresent });

  if (loading.isSpecificPermissions) {
    return <div className={styles.label}><Text>{translateMessage('Fetching permissions')}... </Text></div>;
  }

  if (!validation.isValid) {
    return <div className={styles.label}><Text>{translateMessage('Invalid URL')}!</Text></div>;
  }

  const displayNoPermissionsFoundMessage = (): JSX.Element => (
    <div className={styles.root}>
      <Text>
        {translateMessage('permissions not found in permissions tab')}
        <Link inline onClick={openPermissionsPanel}>
          {translateMessage('open permissions panel')}
        </Link>
        {translateMessage('permissions list')}
      </Text>
    </div>
  );

  const displayNotSignedInMessage = (): JSX.Element => (
    <div className={styles.root}>
      <Text>{translateMessage('sign in to view a list of all permissions')}</Text>
    </div>
  );

  const displayErrorFetchingPermissionsMessage = (): JSX.Element => (
    <div className={styles.errorLabel}><Text>{translateMessage('Fetching permissions failing')}</Text></div>
  );

  if (!tokenPresent && permissions.length === 0) {
    return displayNotSignedInMessage();
  }

  if (permissions.length === 0) {
    return permissionsError?.status && (permissionsError?.status === 404 || permissionsError?.status === 400)
      ? displayNoPermissionsFoundMessage()
      : displayErrorFetchingPermissionsMessage();
  }

  const columnWidths: Record<string, React.CSSProperties> = {
    value: { width: 200 },
    consentDescription: { minWidth: 300 },
    isAdmin: { width: 190 },
    consented: { width: 140 },
    consentType: { width: 140 }
  };

  return (
    <>
      <div className={styles.permissionText}>
        <Label size="small" weight='semibold'>
          {translateMessage(tokenPresent ? 'permissions required to run the query':'sign in to consent to permissions')}
        </Label>
      </div>
      <div className={styles.tableWrapper}>
        <Table
          className={styles.table} aria-label={translateMessage('Permissions Table')}  size="small">
          <TableHeader className={styles.tableHeader}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.columnId}
                  style={{
                    ...columnWidths[column.columnId],
                    textAlign: column.columnId === 'consented' ? 'center' : 'left'
                  }}
                >
                  {column.renderHeaderCell()}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map(({ item, index }) => (
              <TableRow key={item.value}>
                {columns.map((column) => (
                  <TableCell key={column.columnId}>{column.renderCell({ item, index })}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};