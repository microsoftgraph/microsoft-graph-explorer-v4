import {
  Checkbox,
  FontSizes,
  getId,
  getTheme,
  IColumn,
  Icon,
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

export const Permission = ( permissionProps?: IPermissionProps ) => {

  const { sampleQuery, scopes, dimensions, permissionsPanelOpen, authToken } = useSelector( (state: IRootState) => state
  );
  const { pending: loading } = scopes;
  const tokenPresent = !!authToken.token;
  const panel = permissionsPanelOpen;

  const dispatch = useDispatch();


  const classProps = {
    styles: permissionProps!.styles,
    theme: permissionProps!.theme
  };
  const classes = classNames(classProps);

  const theme = getTheme();
  const panelStyles = permissionStyles(theme).panelContainer;
  const tabHeight = convertVhToPx(dimensions.request.height, 110);


  const getPermissions = () => {
    dispatch(permissionActionCreators.fetchScopes());
  }

  const handleConsent = async (permission: IPermission) => {
    const consentScopes = [permission.value];
    dispatch(permissionActionCreators.consentToScopes(consentScopes));
  };

  useEffect(() => {
    getPermissions();
  }, [permissionsPanelOpen, sampleQuery]);

  const renderItemColumn = (item: any, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const consented = !!item.consented;

    if (column) {
      const content = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'isAdmin':
          if (item.isAdmin) {
            return <div style={{ textAlign: 'center' }}>
              <Icon iconName='checkmark' className={classes.checkIcon}
                aria-label={translateMessage('Admin consent required')} />
            </div>;
          } else {
            return <div style={{ textAlign: 'center' }}>
              <Icon iconName='StatusCircleErrorX' className={classes.checkIcon}
                aria-label={translateMessage('Admin consent not required')} />
            </div>;
          }

        case 'consented':
          if (consented) {
            return <Label className={classes.consented}
            ><FormattedMessage id='Consented' /></Label>;
          } else {
            if (!panel) {
              return <PrimaryButton onClick={() => handleConsent(item)}>
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

  const renderCustomCheckbox = (props: any): any => {
    return (
      <div style={{ pointerEvents: 'none' }} >
        <Checkbox checked={props ? props.checked : undefined} />
      </div>
    )
  }

  const getColumns = () => {
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

  const displayPermissionsPanel = () => {
    return <div data-is-scrollable={true} style={panelStyles}>
      <PanelList
        classes={classes}
        messages={messages}
        selection={selection}
        columns={getColumns()}
        renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
          renderItemColumn(item, column)}
        renderDetailsHeader={renderDetailsHeader}
        renderCustomCheckbox={renderCustomCheckbox}
      />
    </div>
  };

  const displayPermissionsAsTab = () => {
    return <TabList
      columns={getColumns()}
      maxHeight={tabHeight}
      renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
        renderItemColumn(item, column)}
      renderDetailsHeader={renderDetailsHeader}
      classes={classes}
    />;
  };

  if (loading) {
    return <Label>
      <FormattedMessage id={'Fetching permissions'} />...
    </Label>;
  }

  return(
    <>
      {panel ? displayPermissionsPanel() : displayPermissionsAsTab()}
    </>
  )
}