import {
  DetailsList, DetailsListLayoutMode, getTheme, IColumn,
  Label, Link, SelectionMode, TooltipHost
} from '@fluentui/react';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { IPermission, IPermissionProps } from '../../../../../types/permissions';
import { ValidationContext } from '../../../../services/context/validation-context/ValidationContext';
import { usePopups } from '../../../../services/hooks';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { ScopesError } from '../../../../utils/error-utils/ScopesError';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { getColumns } from './columns';
import { permissionStyles } from './Permission.styles';
import PermissionItem from './PermissionItem';
import { setConsentedStatus, sortPermissionsWithPrivilege } from './util';

export const Permissions = (permissionProps?: IPermissionProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const validation = useContext(ValidationContext);
  const { sampleQuery, scopes, auth: { authToken, consentedScopes }, dimensions } =
    useAppSelector((state) => state);
  const { show: showPermissions } = usePopups('full-permissions', 'panel');

  const tokenPresent = !!authToken.token;
  const { pending: loading, error } = scopes;
  let permissions: IPermission[] = scopes.data.specificPermissions ? scopes.data.specificPermissions : [];
  const [isScreenSizeReduced, setIsScreenSizeReduced] = useState(false);
  const [permissionsError, setPermissionsError] = useState<ScopesError | null>(error);

  useEffect(() => {
    if (error && error?.url.contains('permissions')) {
      setPermissionsError(error);
    }
  }, [error])

  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };

  const classes = classNames(classProps);
  const theme = getTheme();
  const { tooltipStyles, detailsHeaderStyles } = permissionStyles(theme);
  const tabHeight = convertVhToPx(dimensions.request.height, 110);

  const permissionsTabStyles = {
    root: {
      padding: '17px'
    }
  }

  const openPermissionsPanel = () => {
    showPermissions({
      settings: {
        title: translateMessage('Permissions'),
        width: 'lg'
      }
    })
  }

  const getPermissions = (): void => {
    dispatch(fetchScopes('query'));
    fetchPermissionGrants();
  }

  const fetchPermissionGrants = (): void => {
    if (tokenPresent) {
      dispatch(fetchAllPrincipalGrants());
    }
  }

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

  const renderDetailsHeader = (props: any, defaultRender?: any): JSX.Element => {
    return defaultRender({
      ...props,
      onRenderColumnHeaderTooltip: (tooltipHostProps: any) => {
        return (
          <TooltipHost {...tooltipHostProps} styles={tooltipStyles} />
        );
      },
      styles: detailsHeaderStyles
    });
  }

  if (loading.isSpecificPermissions) {
    return (
      <Label style={{ marginLeft: '12px' }}>
        {translateMessage('Fetching permissions')}...
      </Label>
    );
  }

  if (!validation.isValid) {
    return (
      <Label style={{ marginLeft: '12px' }}>
        {translateMessage('Invalid URL')}!
      </Label>
    );
  }

  const displayNoPermissionsFoundMessage = (): JSX.Element => {
    return (
      <Label styles={permissionsTabStyles}>
        {translateMessage('permissions not found in permissions tab')}
        <Link underline onClick={openPermissionsPanel}>
          {translateMessage('open permissions panel')}
        </Link>
        {translateMessage('permissions list')}
      </Label>);
  }

  const displayNotSignedInMessage = (): JSX.Element => {
    return (
      <Label styles={permissionsTabStyles}>
        {translateMessage('sign in to view a list of all permissions')}
      </Label>)
  }

  const displayErrorFetchingPermissionsMessage = (): JSX.Element => {
    return (<Label className={classes.permissionLabel}>
      {translateMessage('Fetching permissions failing')}
    </Label>);
  }

  if (!tokenPresent && permissions.length === 0) {
    return displayNotSignedInMessage();
  }

  if (permissions.length === 0) {
    return permissionsError?.status && (permissionsError?.status === 404 || permissionsError?.status === 400)
      ? displayNoPermissionsFoundMessage() :
      displayErrorFetchingPermissionsMessage();
  }
  permissions = sortPermissionsWithPrivilege(permissions);
  permissions = setConsentedStatus(tokenPresent, permissions, consentedScopes);

  return (
    <div >
      <Label className={classes.permissionLength} style={{ paddingLeft: '12px' }}>
        {translateMessage('Permissions')}
      </Label>
      <Label className={classes.permissionText} style={{ paddingLeft: '12px' }}>
        {translateMessage(tokenPresent ? 'permissions required to run the query' : 'sign in to consent to permissions')}
      </Label>
      <div
        onMouseEnter={() => {

          if (screen.width < 1260 || window.innerWidth < 1290) {
            setIsScreenSizeReduced(true);
          }
        }
        }
        onMouseLeave={() => setIsScreenSizeReduced(false)}
        style={{ flex: 1 }}
      >
        <DetailsList
          styles={!isScreenSizeReduced ? {
            root:
              { height: tabHeight, overflowX: 'hidden', overflowY: 'auto' }
          } : { root: { height: tabHeight, overflowY: 'auto' } }}
          items={permissions}
          columns={getColumns({ source: 'tab', tokenPresent })}
          onRenderItemColumn={(item?: IPermission, index?: number, column?: IColumn) => {
            return <PermissionItem column={column} index={index!} item={item!} />
          }}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
          onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)} />
      </div>
    </div>
  );
}