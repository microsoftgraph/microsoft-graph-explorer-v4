import {
  Announced, DetailsList, DetailsListLayoutMode, getTheme, GroupHeader, IColumn,
  IDetailsGroupDividerProps,
  IDetailsHeaderProps,
  IGroup, ITooltipHostProps, Label, SearchBox, SelectionMode, TooltipHost
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
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

interface PermissionListItem extends IPermission {
  groupName: string;
}

const FullPermissions: React.FC<PopupsComponent<null>> = (): JSX.Element => {
  const theme = getTheme();
  const dispatch: AppDispatch = useDispatch();

  const { panelContainer: panelStyles, tooltipStyles, detailsHeaderStyles } = permissionStyles(theme);
  const { consentedScopes, scopes, authToken } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const tokenPresent = !!authToken.token;
  const loading = scopes.pending.isFullPermissions;

  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const permissionsList: PermissionListItem[] = [];

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

  const renderDetailsHeader = (properties?: IDetailsHeaderProps, defaultRender?: Function): JSX.Element | null => {
    if (defaultRender) {
      return defaultRender({
        ...properties,
        onRenderColumnHeaderTooltip: (tooltipHostProps: ITooltipHostProps) => {
          return (
            <TooltipHost {...tooltipHostProps} styles={tooltipStyles} />
          );
        },
        styles: detailsHeaderStyles
      });
    }
    return null
  }

  useEffect(() => {
    if (!searchValue && groups && groups.length === 0) {
      setPermissions(sortPermissions(fullPermissions));
    }
  }, [scopes.data]);

  const shouldGenerateGroups = useRef(true)

  useEffect(() => {
    if (shouldGenerateGroups.current) {
      setGroups(generateGroupsFromList(permissionsList, 'groupName'));
      if (groups && groups.length > 0) {
        shouldGenerateGroups.current = false;
      }
      if (permissionsList.length === 0) { return }
    }
  }, [permissions, searchStarted])


  setConsentedStatus(tokenPresent, permissions, consentedScopes);

  permissions.forEach((perm: IPermission) => {
    const permission = { ...perm } as PermissionListItem;
    const permissionValue = permission.value;
    const groupName = permissionValue.split('.')[0];
    permission.groupName = groupName;
    permissionsList.push(permission);
  });

  const searchValueChanged = (value?: string): void => {
    setSearchValue(value!);
    shouldGenerateGroups.current = true;
    setSearchStarted((search) => !search);
    let filteredPermissions = scopes.data.fullPermissions;
    if (value) {
      const keyword = value.toLowerCase();

      filteredPermissions = fullPermissions.filter((permission: IPermission) => {
        const name = permission.value.toLowerCase();
        const groupName = permission.value.split('.')[0].toLowerCase();
        return name.includes(keyword) || groupName.includes(keyword);
      });
    }
    setPermissions(filteredPermissions);
  };


  const onRenderGroupHeader = (props?: IDetailsGroupDividerProps): JSX.Element | null => {
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
          <SearchBox
            placeholder={translateMessage('Search permissions')}
            onChange={(e?: React.ChangeEvent<HTMLInputElement>, value?: string) => searchValueChanged(value)}
            styles={searchBoxStyles}
            onClear={() => clearSearchBox()}
            value={searchValue}
          />
          <Announced message={`${permissions.length} search results available.`} />
          <hr />
          <DetailsList
            onShouldVirtualize={() => false}
            items={permissions}
            columns={getColumns('panel', tokenPresent)}
            groups={groups}
            onRenderItemColumn={(item?: IPermission, index?: number, column?: IColumn) => {
              return <PermissionItem column={column} index={index!} item={item!} />
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
            onRenderDetailsHeader={renderDetailsHeader}
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