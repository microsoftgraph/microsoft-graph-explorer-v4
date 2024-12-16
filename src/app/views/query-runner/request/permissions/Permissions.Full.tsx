import {
  Announced, DetailsList, DetailsListLayoutMode, getId, getTheme, GroupHeader, IColumn,
  IconButton,
  IContextualMenuProps,
  Label, SearchBox, SelectionMode, Stack, TooltipHost
} from '@fluentui/react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { fetchAllPrincipalGrants } from '../../../../services/slices/permission-grants.slice';
import { fetchScopes } from '../../../../services/slices/scopes.slice';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { searchBoxStyles } from '../../../../utils/searchbox.styles';
import { translateMessage } from '../../../../utils/translate-messages';
import { getColumns } from './columns';
import { permissionStyles } from './Permission.styles';
import PermissionItem from './PermissionItem';
import { setConsentedStatus } from './util';

type Filter = 'all-permissions' | 'consented-permissions' | 'unconsented-permissions';
interface PermissionListItem extends IPermission {
  groupName?: string;
}

const FullPermissions: React.FC<PopupsComponent<null>> = (): JSX.Element => {
  const theme = getTheme();
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<Filter>('all-permissions');

  const { panelContainer: panelStyles, tooltipStyles, detailsHeaderStyles } = permissionStyles(theme);
  const { scopes, auth: { consentedScopes, authToken } } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!authToken.token;
  const loading = scopes.pending.isFullPermissions;

  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  let listOfPermissions: IPermission[] = permissions;

  const getPermissions = (): void => {
    dispatch(fetchScopes('full'));
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

  const sortPermissions = (permissionsToSort: IPermission[]): IPermission[] => {
    try {
      return [...permissionsToSort].sort(dynamicSort<IPermission>('value', SortOrder.ASC));
    } catch (error) {
      // ignore
    }
    return permissionsToSort;
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

  const searchValueChanged = (value?: string): void => {
    setSearchValue(value!);
    const searchResults = searchPermissions(value);
    const values = filter === 'all-permissions' ? searchResults : searchResults.filter((permission: IPermission) => {
      if (filter === 'consented-permissions') {
        return permission.consented;
      }
      return !permission.consented;
    });
    setPermissions(values);
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
    searchValueChanged('');
  }

  const chooseFilter = (chosenFilter: Filter) => {
    setFilter(chosenFilter);
    const searchResults = searchPermissions(searchValue);
    switch (chosenFilter) {
    case 'all-permissions': {
      setPermissions(searchResults);
      break;
    }
    case 'consented-permissions': {
      setPermissions(setConsentedStatus(tokenPresent, searchResults, consentedScopes)
        .filter((permission: IPermission) => permission.consented));
      break;
    }
    case 'unconsented-permissions': {
      setPermissions(setConsentedStatus(tokenPresent, searchResults, consentedScopes)
        .filter((permission: IPermission) => !permission.consented));
      break;
    }
    }
  }

  const handleRenderItemColumn = (item?: IPermission, index?: number, column?: IColumn) => {
    return <PermissionItem column={column} index={index!} item={item!} />;
  }

  const columns = getColumns({ source: 'panel', tokenPresent });
  listOfPermissions = setConsentedStatus(tokenPresent, sortPermissions(permissions), consentedScopes);
  const permissionsList: PermissionListItem[] = [];
  listOfPermissions.map((perm: IPermission) => {
    const permission: PermissionListItem = { ...perm };
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
        onClick: () => chooseFilter('all-permissions')
      },
      {
        key: 'consented-permissions',
        text: translateMessage('Consented permissions'),
        onClick: () => chooseFilter('consented-permissions')
      },
      {
        key: 'unconsented-permissions',
        text: translateMessage('Unconsented permissions'),
        onClick: () => chooseFilter('unconsented-permissions')
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
        {translateMessage('Fetching permissions')}...
      </Label> :
        <>
          <Label>
            {translateMessage('Select different permissions')}
          </Label>
          <hr />
          <Stack horizontal tokens={{ childrenGap: 7 }}>

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
                menuIconProps={{ iconName: filter === 'all-permissions' ? 'Filter' : 'FilterSolid' }}
                menuProps={menuProperties}
                onMenuClick={trackFilterButtonClickEvent}
                styles={{
                  root: {
                    float: 'left',
                    width: '100%'
                  }
                }}
              />
            </TooltipHost>
            <SearchBox
              placeholder={translateMessage('Search permissions')}
              onChange={(_event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) =>
                searchValueChanged(newValue)}
              styles={searchBoxStyles}
              onClear={() => clearSearchBox()}
              value={searchValue}
            />
            <Announced message={`${listOfPermissions.length} search results available.`} />
          </Stack>
          <hr />
          <DetailsList
            onShouldVirtualize={() => false}
            items={listOfPermissions}
            columns={columns}
            groups={groups}
            onRenderItemColumn={handleRenderItemColumn}
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

      {!loading && listOfPermissions && listOfPermissions.length === 0 && scopes?.error &&
        scopes?.error?.status && scopes?.error?.status === 404 ?
        <Label style={{
          display: 'flex',
          width: '100%',
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {translateMessage('permissions not found')}
        </Label> :
        !loading && permissions && permissions.length === 0 && scopes.error &&
        <Label>
          {translateMessage('Fetching permissions failing')}
        </Label>
      }
    </div>
  );
};
export default FullPermissions;