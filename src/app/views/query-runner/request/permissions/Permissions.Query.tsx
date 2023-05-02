import {
  DetailsList, DetailsListLayoutMode, getTheme, IColumn,
  Label, Link, SelectionMode, TooltipHost
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IPermission, IPermissionProps } from '../../../../../types/permissions';
import { fetchAllPrincipalGrants, fetchScopes } from '../../../../services/actions/permissions-action-creator';
import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { permissionStyles } from './Permission.styles';
import PermissionItem from './PermissionItem';
import { setConsentedStatus } from './util';
import { getColumns } from './columns';

export const Permissions = (permissionProps?: IPermissionProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { sampleQuery, scopes, dimensions, authToken, consentedScopes } =
    useAppSelector((state) => state);
  const { show: showPermissions } = usePopups('full-permissions', 'panel');

  const tokenPresent = !!authToken.token;
  const { pending: loading } = scopes;
  const permissions: IPermission[] = scopes.data.specificPermissions ? scopes.data.specificPermissions : [];
  const [isScreenSizeReduced, setIsScreenSizeReduced] = useState(false);

  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };

  const classes = classNames(classProps);
  const theme = getTheme();
  const { tooltipStyles, detailsHeaderStyles } = permissionStyles(theme);
  const tabHeight = convertVhToPx(dimensions.request.height, 110);

  setConsentedStatus(tokenPresent, permissions, consentedScopes);

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
    getPermissions();
  }, [sampleQuery]);

  useEffect(() => {
    setConsentedStatus(tokenPresent, permissions, consentedScopes);
  }, [consentedScopes]);

  useEffect(() => {
    if (tokenPresent) {
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
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>
    );
  }

  const displayNoPermissionsFoundMessage = (): JSX.Element => {
    return (
      <Label styles={permissionsTabStyles}>
        <FormattedMessage id='permissions not found in permissions tab' />
        <Link underline onClick={openPermissionsPanel}>
          <FormattedMessage id='open permissions panel' />
        </Link>
        <FormattedMessage id='permissions list' />
      </Label>);
  }

  const displayNotSignedInMessage = (): JSX.Element => {
    return (
      <Label styles={permissionsTabStyles}>
        <FormattedMessage id='sign in to view a list of all permissions' />
      </Label>)
  }

  if (!tokenPresent && permissions.length === 0) {
    return displayNotSignedInMessage();
  }

  if (permissions.length === 0) {
    return displayNoPermissionsFoundMessage();
  }

  return (
    <>
      <Label className={classes.permissionLength} style={{ paddingLeft: '12px' }}>
        <FormattedMessage id='Permissions' />
      </Label>
      <Label className={classes.permissionText} style={{ paddingLeft: '12px' }}>
        {!tokenPresent && <FormattedMessage id='sign in to consent to permissions' />}
        {tokenPresent && <FormattedMessage id='permissions required to run the query' />}
      </Label>
      <div
        onMouseEnter={() => {

          if (screen.width < 1260 || window.innerWidth < 1290) {
            setIsScreenSizeReduced(true);
          }
        }
        }
        onMouseLeave={() => setIsScreenSizeReduced(false)}>
        <DetailsList
          styles={!isScreenSizeReduced ? {
            root:
              { maxHeight: tabHeight, overflowX: 'hidden' }
          } : { root: { maxHeight: tabHeight } }}
          items={permissions}
          columns={getColumns('tab', tokenPresent)}
          onRenderItemColumn={(item?: any, index?: number, column?: IColumn) => {
            return <PermissionItem column={column} index={index} item={item} />
          }}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
          onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)} />
      </div>
    </>
  );
}