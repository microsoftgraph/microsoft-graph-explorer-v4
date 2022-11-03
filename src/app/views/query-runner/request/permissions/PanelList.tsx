import {
  Announced, DetailsList, DetailsListLayoutMode, getTheme, GroupHeader, IColumn,
  IGroup, IOverlayProps, Label, Panel, PanelType,
  SearchBox, SelectionMode
} from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { SortOrder } from '../../../../../types/enums';
import { IPermission } from '../../../../../types/permissions';
import { togglePermissionsPanel } from '../../../../services/actions/permissions-panel-action-creator';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { searchBoxStyles } from '../../../../utils/searchbox.styles';
import { translateMessage } from '../../../../utils/translate-messages';
import { profileStyles } from '../../../authentication/profile/Profile.styles';
import { setConsentedStatus } from './util';

interface IPanelList {
  messages: any;
  columns: any[];
  classes: any;
  renderItemColumn: any;
  renderDetailsHeader: Function;
}

const PanelList = ({ messages,
  columns, classes, renderItemColumn, renderDetailsHeader }: IPanelList) : JSX.Element => {

  const sortPermissions = (permissionsToSort: IPermission[]): IPermission[] => {
    return permissionsToSort ? permissionsToSort.sort(dynamicSort('value', SortOrder.ASC)) : [];
  }

  const { consentedScopes, scopes, authToken,
    permissionsPanelOpen } = useAppSelector((state) => state);
  const { fullPermissions } = scopes.data;
  const [permissions, setPermissions] = useState<any []>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const permissionsList: any[] = [];
  const tokenPresent = !!authToken.token;
  const loading = scopes.pending.isFullPermissions;

  const theme = getTheme();
  const { permissionPanelStyles } = profileStyles(theme);

  useEffect(() => {
    setPermissions(sortPermissions(fullPermissions));
  }, [permissionsPanelOpen, scopes.data]);

  const shouldGenerateGroups = useRef(true)

  useEffect(() => {
    if (shouldGenerateGroups.current) {
      setGroups(generateGroupsFromList(permissionsList, 'groupName'));
      if(groups && groups.length > 0) {
        shouldGenerateGroups.current = false;
      }
      if(permissionsList.length === 0){ return }
    }
  }, [permissions, searchStarted])


  const dispatch: AppDispatch = useDispatch();

  setConsentedStatus(tokenPresent, permissions, consentedScopes);

  permissions.forEach((perm: IPermission) => {
    const permission: any = { ...perm };
    const permissionValue = permission.value;
    const groupName = permissionValue.split('.')[0];
    permission.groupName = groupName;
    permissionsList.push(permission);
  });

  const searchValueChanged = (event: any, value?: string): void => {
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


  const onRenderGroupHeader = (props: any): JSX.Element | null => {
    if (props) {
      return (
        <GroupHeader  {...props} onRenderGroupHeaderCheckbox={hideCheckbox} styles={groupHeaderStyles}
        />
      )
    }
    return null;
  };

  const changePanelState = () => {
    let open = !!permissionsPanelOpen;
    open = !open;
    dispatch(togglePermissionsPanel(open));
    trackSelectPermissionsButtonClickEvent();
  };

  const trackSelectPermissionsButtonClickEvent = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.VIEW_ALL_PERMISSIONS_BUTTON
    });
  };

  const panelOverlayProps: IOverlayProps = {
    isDarkThemed: true
  }

  const displayLoadingPermissionsText = () => {
    return (
      <Label>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>
    );
  }

  const groupHeaderStyles = () => {
    return {
      check: { display: 'none'},
      root: { background: theme.palette.white}
    }
  }

  const hideCheckbox = (): JSX.Element => {
    return (
      <div/>
    )
  }

  return (
    <div>
      <Panel
        isOpen={permissionsPanelOpen}
        onDismiss={() => changePanelState()}
        type={PanelType.largeFixed}
        hasCloseButton={true}
        headerText={translateMessage('Permissions')}
        isFooterAtBottom={true}
        closeButtonAriaLabel='Close'
        overlayProps={panelOverlayProps}
        styles={permissionPanelStyles}
      >
        {loading ? displayLoadingPermissionsText() :
          <>
            <Label className={classes.permissionText}>
              <FormattedMessage id='Select different permissions' />
            </Label>
            <hr />
            <SearchBox
              className={classes.searchBox}
              placeholder={messages['Search permissions']}
              onChange={(event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) =>
                searchValueChanged(event, newValue)}
              styles={searchBoxStyles}
            />
            <Announced message={`${permissions.length} search results available.`} />
            <hr />
            <DetailsList
              onShouldVirtualize={() => false}
              items={permissions}
              columns={columns}
              groups={groups}
              onRenderItemColumn={(item?: any, index?: number, column?: IColumn) =>
                renderItemColumn(item, index, column)}
              selectionMode={SelectionMode.multiple}
              layoutMode={DetailsListLayoutMode.justified}
              compact={true}
              groupProps={{
                showEmptyGroups: false,
                onRenderHeader: onRenderGroupHeader
              }}
              ariaLabelForSelectionColumn={messages['Toggle selection'] || 'Toggle selection'}
              ariaLabelForSelectAllCheckbox={messages['Toggle selection for all items'] ||
             'Toggle selection for all items'}
              checkButtonAriaLabel={messages['Row checkbox'] || 'Row checkbox'}
              onRenderDetailsHeader={(props?: any, defaultRender?: any) => renderDetailsHeader(props, defaultRender)}
              onRenderCheckbox={() => hideCheckbox()}
            />
          </>}

        {!loading && permissions && permissions.length === 0 &&
        <Label style={{
          display: 'flex',
          width: '100%',
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FormattedMessage id='permissions not found' />
        </Label>
        }
      </Panel>
    </div>
  );
};
export default PanelList;