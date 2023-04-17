import { getTheme, IColumn, Label, TooltipHost } from '@fluentui/react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IPermissionProps } from '../../../../../types/permissions';
import { fetchAllPrincipalGrants, fetchScopes } from '../../../../services/actions/permissions-action-creator';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import { getColumns } from './columns';
import { permissionStyles } from './Permission.styles';
import PermissionItem from './PermissionItem';
import TabList from './TabList';

export const Permission = (permissionProps?: IPermissionProps): JSX.Element => {
  const { sampleQuery, scopes, dimensions, authToken, consentedScopes } =
    useAppSelector((state) => state);
  const { pending: loading } = scopes;
  const tokenPresent = !!authToken.token;
  const dispatch: AppDispatch = useDispatch();

  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };

  const classes = classNames(classProps);
  const theme = getTheme();
  const { tooltipStyles, detailsHeaderStyles } = permissionStyles(theme);
  const tabHeight = convertVhToPx(dimensions.request.height, 110);

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
  }, [sampleQuery, consentedScopes]);

  const renderDetailsHeader = (props: any, defaultRender?: any): JSX.Element => {
    return defaultRender!({
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

  return <TabList
    columns={getColumns('tab', tokenPresent)}
    maxHeight={tabHeight}
    renderItemColumn={(item?: any, index?: number, column?: IColumn) => {
      return <PermissionItem column={column} index={index} item={item} />
    }}
    renderDetailsHeader={renderDetailsHeader}
    classes={classes}
  />;
}