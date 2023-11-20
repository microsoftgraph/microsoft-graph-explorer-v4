import {
  Announced, DetailsList, DetailsListLayoutMode, getId, getTheme, GroupHeader, IColumn,
  IconButton,
  IContextualMenuProps,
  Label, SearchBox, SelectionMode, Stack, TooltipHost
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { fetchAllPrincipalGrants, fetchScopes } from '../../../../services/actions/permissions-action-creator';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { searchBoxStyles } from '../../../../utils/searchbox.styles';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columns';
import { permissionStyles } from './Permission.styles';
import PermissionItem from './PermissionItem';
import { setConsentedStatus } from './util';

const FullPermissions: React.FC<PopupsComponent<null>> = (): JSX.Element => {
  const theme = getTheme();
  const dispatch: AppDispatch = useDispatch();

  const { panelContainer: panelStyles, tooltipStyles, detailsHeaderStyles } = permissionStyles(theme);
  const { consentedScopes, scopes, authToken } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!authToken.token;
  const loading = scopes.pending.isFullPermissions;

  const [permissions, setPermissions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const getPermissions = (): void => {
    dispatch(fetchScopes());
    fetchPermissionGrants();
  }

  const fetchPermissionGrants = (): void => {
    if (tokenPresent) {
      dispatch(fetchAllPrincipalGrants());
    }
  }

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    setConsentedStatus(tokenPresent, permissions, consentedScopes);
  }, [consentedScopes]);

  const sortPermissions = (permissionsToSort: IPermission[]): IPermission[] => {
    return permissionsToSort ? permissionsToSort.sort(dynamicSort('value', SortOrder.ASC)) : [];
  }

  const renderDetailsHeader = (properties: any, defaultRender?: any): JSX.Element => {
    return defaultRender({
      ...properties,
      onRenderColumnHeaderTooltip: (tooltipHostProps: any) => {
        return (
          <TooltipHost {...tooltipHostProps} styles={tooltipStyles} />
        );
      },
      styles: detailsHeaderStyles
    });
  }

  useEffect(() => {
    if (!searchValue && groups && groups.length === 0) {
      setPermissions(sortPermissions(fullPermissions));
    }
  }, [scopes.data]);

  setConsentedStatus(tokenPresent, permissions, consentedScopes);

  const searchValueChanged = (event: any, value?: string): void => {
    setSearchValue(value!);
    setPermissions(searchPermissions(value));
  };

  const searchPermissions = (value?: string) => {
    let filteredPermissions = scopes.data.fullPermissions;
    if (value) {
      const keyword = value.toLowerCase();

      filteredPermissions = fullPermissions.filter((permission: IPermission) => {
        const name = permission.value.toLowerCase();
        const groupName = permission.value.split('.')[0].toLowerCase();
        return name.includes(keyword) || groupName.includes(keyword);
      });
    }
    return filteredPermissions;
  }

  const onRenderGroupHeader = (props: any): JSX.Element | null => {
    if (props) {
      return (
        <GroupHeader  {...props} onRenderGroupHeaderCheckbox={hideCheckbox} styles={groupHeaderStyles}
        />
      )
    }
    return null;
  };

  const groupHeaderStyles = () => {
    return {
      check: { display: 'none' },
      root: { background: theme.palette.white },
      title: { padding: '10px' }
    }
  }

  const hideCheckbox = (): JSX.Element => {
    return (
      <div />
    )
  }

  const clearSearchBox = () => {
    setSearchValue('');
    searchValueChanged({}, '');
  }

  const columns = getColumns({ source: 'panel', tokenPresent });
  const permissionsList: any[] = [];
  permissions.map((perm: IPermission) => {
    const permission: any = { ...perm };
    const permissionValue = permission.value;
    permission.groupName = permissionValue.split('.')[0];
    permissionsList.push(permission);
  });
  const groups = generateGroupsFromList(permissionsList, 'groupName');

  const menuProperties: IContextualMenuProps = {
    items: [
      {
        key: 'all-permissions',
        text: translateMessage('All permissions'),
        onClick: () => setPermissions(searchPermissions(searchValue))
      },
      {
        key: 'consented-permissions',
        text: translateMessage('Consented permissions'),
        onClick: () => setPermissions(searchPermissions(searchValue)
          .filter((permission: IPermission) => permission.consented))
      },
      {
        key: 'unconsented-permissions',
        text: translateMessage('Unconsented permissions'),
        onClick: () => setPermissions(searchPermissions(searchValue)
          .filter((permission: IPermission) => !permission.consented))
      }
    ]
  };

  const trackFilterButtonClickEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.FILTER_PERMISSIONS_BUTTON
    });
  }

  return (
    <div data-is-scrollable={true} style={panelStyles}>
      {loading ? <Label>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label> :
        <>
          <Label>
            <FormattedMessage id='Select different permissions' />
          </Label>
          <hr />
          <Stack horizontal>
            <SearchBox
              placeholder={translateMessage('Search permissions')}
              onChange={(event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) =>
                searchValueChanged(event, newValue)}
              styles={searchBoxStyles}
              onClear={() => clearSearchBox()}
              value={searchValue}
            />
            <Announced message={`${permissions.length} search results available.`} />
            <TooltipHost
              content={
                <div style={{ padding: '3px' }}>
                  {translateMessage('Filter permissions')}
                </div>}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={tooltipStyles}
            >
              <IconButton
                ariaLabel={translateMessage('Filter permissions')}
                role='button'
                disabled={loading || fullPermissions.length === 0}
                menuIconProps={{ iconName: 'Filter' }}
                menuProps={menuProperties}
                onMenuClick={trackFilterButtonClickEvent}
              />
            </TooltipHost>
          </Stack>
          <hr />
          <DetailsList
            onShouldVirtualize={() => false}
            items={permissions}
            columns={columns}
            groups={groups}
            onRenderItemColumn={(item?: any, index?: number, column?: IColumn) => {
              return <PermissionItem column={column} index={index} item={item} />
            }}
            selectionMode={SelectionMode.multiple}
            layoutMode={DetailsListLayoutMode.justified}
            compact={true}
            groupProps={{
              showEmptyGroups: false,
              onRenderHeader: onRenderGroupHeader
            }}
            ariaLabelForSelectionColumn={translateMessage('Toggle selection') || 'Toggle selection'}
            ariaLabelForSelectAllCheckbox={translateMessage('Toggle selection for all items') ||
              'Toggle selection for all items'}
            checkButtonAriaLabel={translateMessage('Row checkbox') || 'Row checkbox'}
            onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)}
            onRenderCheckbox={() => hideCheckbox()}
          />
        </>}

      {!loading && permissions && permissions.length === 0 && scopes?.error && scopes?.error?.error &&
        scopes?.error?.error?.status && scopes?.error?.error?.status === 404 ?
        <Label style={{
          display: 'flex',
          width: '100%',
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FormattedMessage id='permissions not found' />
        </Label> :
        !loading && permissions && permissions.length === 0 && scopes.error && scopes.error.error &&
        <Label>
          <FormattedMessage id='Fetching permissions failing' />
        </Label>
      }
    </div>
  );
};
export default FullPermissions;