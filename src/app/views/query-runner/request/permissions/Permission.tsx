import {
  Checkbox,
  FontSizes,
  getId,
  getTheme,
  IColumn,
  IDetailsListCheckboxProps,
  Label,
  PrimaryButton,
  Selection,
  TooltipHost
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IPermission, IPermissionProps } from '../../../../../types/permissions';
import { IRootState } from '../../../../../types/root';
import * as permissionActionCreators from '../../../../services/actions/permissions-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions/dimensions-adjustment';
import PanelList from './PanelList';
import { permissionStyles } from './Permission.styles';
import TabList from './TabList';
import messages from '../../../../../messages';

export const Permission = ( permissionProps?: IPermissionProps ) : JSX.Element => {

  const { sampleQuery, scopes, dimensions, authToken } =
  useSelector( (state: IRootState) => state );
  const { pending: loading } = scopes;
  const tokenPresent = !!authToken.token;
  const dispatch = useDispatch();
  const panel = permissionProps?.panel;

  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };

  const classes = classNames(classProps);
  const theme = getTheme();
  const panelStyles = permissionStyles(theme).panelContainer;
  const tabHeight = convertVhToPx(dimensions.request.height, 110);


  const getPermissions = () : void => {
    dispatch(permissionActionCreators.fetchScopes());
  }

  useEffect(() => {
    getPermissions();
  },[sampleQuery]);

  const handleConsent = async (permission: IPermission) : Promise<void> => {
    const consentScopes = [permission.value];
    dispatch(permissionActionCreators.consentToScopes(consentScopes));
  };

  const handleUnconsent = async (permission: IPermission) : Promise<void> => {
    dispatch(permissionActionCreators.unconsentToScopes(permission.value));
  };

  const renderItemColumn = (item: any, index: any, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const consented = !!item.consented;

    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          if (item.isAdmin) {
            return <div style={{ textAlign: 'center' }}>
              <Label><FormattedMessage id='Yes' /></Label>
            </div>;
          } else {
            return <div style={{ textAlign: 'center' }}>
              <Label><FormattedMessage id='No' /></Label>
            </div>;
          }

        case 'consented':
          if (consented) {
            return <PrimaryButton onClick={() => handleUnconsent(item)} style={{width: '80px'}}>
              <FormattedMessage id='Unconsent' />
            </PrimaryButton>;
          } else {
            if (!panel) {
              return <PrimaryButton onClick={() => handleConsent(item)} style={{width: '80px'}}>
                <FormattedMessage id='Consent' />
              </PrimaryButton>;
            }
            return null;
          }

        case 'consentDescription':
          return <>
            <TooltipHost
              content={item.consentDescription}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              styles={{
                root: { display: 'block' }
              }}
            >
              <span aria-labelledby={hostId}>
                {item.consentDescription}
              </span>
            </TooltipHost>
          </>;

        default:
          return (
            <TooltipHost
              content={content}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              className={classes.tooltipHost}
            >
              <span aria-labelledby={hostId} style={{ fontSize: FontSizes.medium }}>
                {content}
              </span>
            </TooltipHost>
          );
      }
    }
  };

  const renderDetailsHeader = (props: any, defaultRender?: any) => {
    return defaultRender!({
      ...props,
      onRenderColumnHeaderTooltip: (tooltipHostProps: any) => {
        return (
          <TooltipHost {...tooltipHostProps} />
        );
      }
    });
  }

  const renderCustomCheckbox = (props: IDetailsListCheckboxProps): JSX.Element => {
    return (
      <div style={{ pointerEvents: 'none' }} >
        <Checkbox checked={props ? props.checked : undefined} />
      </div>
    )
  }

  const getColumns = () : IColumn[] => {
    const columns: IColumn[] = [
      {
        key: 'value',
        name: translateMessage('Permission'),
        fieldName: 'value',
        minWidth: 200,
        maxWidth: 250,
        isResizable: true,
        columnActionsMode: 0
      }
    ];

    if (!panel) {
      columns.push(
        {
          key: 'consentDescription',
          name: translateMessage('Description'),
          fieldName: 'consentDescription',
          isResizable: true,
          minWidth: (tokenPresent) ? 400 : 600,
          maxWidth: (tokenPresent) ? 600 : 1000,
          isMultiline: true,
          columnActionsMode: 0
        }
      );
    }

    columns.push(
      {
        key: 'isAdmin',
        isResizable: true,
        name: translateMessage('Admin consent required'),
        fieldName: 'isAdmin',
        minWidth: (tokenPresent) ? 150 : 200,
        maxWidth: (tokenPresent) ? 200 : 300,
        ariaLabel: translateMessage('Administrator permission'),
        columnActionsMode: 0
      }
    );

    if (tokenPresent) {
      columns.push(
        {
          key: 'consented',
          name: translateMessage('Status'),
          isResizable: false,
          fieldName: 'consented',
          minWidth: 100,
          maxWidth: 100
        }
      );
    }
    return columns;
  }

  const selection = new Selection({
    onSelectionChanged: () => {
      const selected = selection.getSelection() as any;
      const permissionsToConsent: string[] = [];
      if (selected.length > 0) {
        selected.forEach((option: IPermission) => {
          permissionsToConsent.push(option.value);
        });
      }
      if(permissionProps!.setPermissions){
        permissionProps!.setPermissions(permissionsToConsent);
      }
    }
  });

  const displayPermissionsPanel = () : JSX.Element => {
    if (loading.isFullPermissions) {
      return displayLoadingPermissionsText();
    }

    return <div data-is-scrollable={true} style={panelStyles}>
      <PanelList
        classes={classes}
        messages={messages}
        selection={selection}
        columns={getColumns()}
        renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
          renderItemColumn(item, index, column)}
        renderDetailsHeader={renderDetailsHeader}
        renderCustomCheckbox={renderCustomCheckbox}
      />
    </div>
  };

  const displayPermissionsAsTab = () : JSX.Element => {
    if (loading.isSpecificPermissions) {
      return displayLoadingPermissionsText();
    }

    return <TabList
      columns={getColumns()}
      maxHeight={tabHeight}
      renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
        renderItemColumn(item, index, column)}
      renderDetailsHeader={renderDetailsHeader}
      classes={classes}
    />;
  };

  const displayLoadingPermissionsText = () => {
    return (
      <Label style={{marginLeft: '12px'}}>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>
    );
  }

  return(
    <>
      {panel ? displayPermissionsPanel() : displayPermissionsAsTab()}
    </>
  );
}