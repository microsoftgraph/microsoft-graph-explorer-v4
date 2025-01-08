import {
  Table, TableHeader, TableRow, TableCell, TableBody, TableColumnDefinition,
  Label, Button, makeStyles, shorthands
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
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { getColumns } from './columnsV9';
import { setConsentedStatus, sortPermissionsWithPrivilege } from './util';

const useStyles = makeStyles({
  root: {
    ...shorthands.padding('17px')
  },
  label: {
    marginLeft: '12px'
  },
  tableWrapper: {
    flex: 1,
    overflowY: 'auto'
  },
  reducedScreenSize: {
    height: '100%',
    overflowY: 'auto'
  }
});

export const Permissions = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);
  const { sampleQuery, scopes, auth: { authToken, consentedScopes }, dimensions } =
        useAppSelector((state) => state);
  const { show: showPermissions } = usePopups('full-permissions', 'panel');

  const tokenPresent = !!authToken.token;
  const { pending: loading, error } = scopes;
  let permissions: IPermission[] = scopes.data.specificPermissions ? scopes.data.specificPermissions : [];
  const [permissionsError, setPermissionsError] = useState<ScopesError | null>(error);

  const styles = useStyles();
  const tabHeight = convertVhToPx(dimensions.request.height, 110);

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

  const columns: TableColumnDefinition<IPermission>[] = getColumns({
    source: 'tab',
    tokenPresent
  });

  if (loading.isSpecificPermissions) {
    return <Label className={styles.label}>{translateMessage('Fetching permissions')}...</Label>;
  }

  if (!validation.isValid) {
    return <Label className={styles.label}>{translateMessage('Invalid URL')}!</Label>;
  }

  const displayNoPermissionsFoundMessage = (): JSX.Element => (
    <Label className={styles.root}>
      {translateMessage('permissions not found in permissions tab')}
      <Button appearance="transparent" onClick={openPermissionsPanel}>
        {translateMessage('open permissions panel')}
      </Button>
      {translateMessage('permissions list')}
    </Label>
  );

  const displayNotSignedInMessage = (): JSX.Element => (
    <Label className={styles.root}>
      {translateMessage('sign in to view a list of all permissions')}
    </Label>
  );

  const displayErrorFetchingPermissionsMessage = (): JSX.Element => (
    <Label className={styles.label}>{translateMessage('Fetching permissions failing')}</Label>
  );

  if (!tokenPresent && permissions.length === 0) {
    return displayNotSignedInMessage();
  }

  if (permissions.length === 0) {
    return permissionsError?.status && (permissionsError?.status === 404 || permissionsError?.status === 400)
      ? displayNoPermissionsFoundMessage()
      : displayErrorFetchingPermissionsMessage();
  }

  permissions = sortPermissionsWithPrivilege(permissions);
  permissions = setConsentedStatus(tokenPresent, permissions, consentedScopes);

  return (
    <div>
      <Label className={styles.label}>
        {translateMessage(tokenPresent ? 'permissions required to run the query' : 'sign in to consent to permissions')}
      </Label>
      <div
        className={styles.tableWrapper}
        style={{ height: tabHeight }}
      >
        <Table
          aria-label={translateMessage('Permissions Table')}
        >
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.columnId}>{column.renderHeaderCell()}</TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.value}>
                {columns.map((column) => (
                  <TableCell key={column.columnId}>{column.renderCell(permission)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};