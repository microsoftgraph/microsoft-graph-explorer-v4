import {
  FontSizes,
  getId,
  IColumn,
  Icon,
  Label,
  PrimaryButton,
  Selection,
  styled,
  TooltipHost
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { componentNames, telemetry } from '../../../../../telemetry';
import { IPermission, IPermissionProps, IPermissionState } from '../../../../../types/permissions';
import { IRootState } from '../../../../../types/root';
import * as permissionActionCreators from '../../../../services/actions/permissions-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import { convertVhToPx } from '../../../common/dimensions-adjustment';
import PanelList from './PanelList';
import { permissionStyles } from './Permission.styles';
import TabList from './TabList';

export class Permission extends Component<IPermissionProps, IPermissionState> {

  constructor(props: IPermissionProps) {
    super(props);
    this.state = {
      permissions: [],
    };
  }

  public componentDidMount = () => {
    this.getPermissions();
  }

  public componentDidUpdate = (prevProps: IPermissionProps) => {
    if ((prevProps.sample !== this.props.sample) || (prevProps.permissionsPanelOpen !== this.props.permissionsPanelOpen)) {
      this.getPermissions();
    }
    const permissions = this.props.scopes.data;
    if (prevProps.scopes.data !== permissions) {
      this.setState({
        permissions
      });
    }
  }

  private getPermissions() {
    this.props.actions!.fetchScopes();
  }

  public shouldComponentUpdate(nextProps: IPermissionProps, nextState: IPermissionState) {
    const shouldUpdate = nextProps.sample !== this.props.sample
      || nextProps.scopes !== this.props.scopes
      || nextProps.consentedScopes !== this.props.consentedScopes
      || nextProps.dimensions !== this.props.dimensions
      || nextProps.permissionsPanelOpen !== this.props.permissionsPanelOpen
      || nextState.permissions !== this.state.permissions;
    return shouldUpdate;
  }

  public handleConsent = async (permission: IPermission) => {
    const consentScopes = [permission.value];
    this.props.actions!.consentToScopes(consentScopes);
  };

  private renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const hostId: string = getId('tooltipHost');
    const consented = !!item.consented;
    const classes = classNames(this.props);
    const {
      panel,
    }: any = this.props;

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
              return <PrimaryButton onClick={() => this.handleConsent(item)}>
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
          </>
            ;

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

  private renderDetailsHeader(props: any, defaultRender?: any) {
    return defaultRender!({
      ...props,
      onRenderColumnHeaderTooltip: (tooltipHostProps: any) => {
        return (
          <TooltipHost {...tooltipHostProps} />
        );
      }
    });
  }

  private getColumns = () => {
    const {
      tokenPresent,
      panel,
      intl: { messages },
    }: any = this.props;

    const columns: IColumn[] = [
      {
        key: 'value',
        name: messages.Permission,
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
          name: messages.Description,
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
        name: messages['Admin consent required'],
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
          name: messages.Status,
          isResizable: false,
          fieldName: 'consented',
          minWidth: 100,
          maxWidth: 100
        }
      );
    }
    return columns;
  }

  public render() {
    const classes = classNames(this.props);
    const { panel, scopes, dimensions } = this.props;
    const { pending: loading } = scopes;

    const {
      intl: { messages },
    }: any = this.props;

    const selection = new Selection({
      onSelectionChanged: () => {
        const selected = selection.getSelection() as any;
        const permissionsToConsent: string[] = [];
        if (selected.length > 0) {
          selected.forEach((option: IPermission) => {
            permissionsToConsent.push(option.value);
          });
        }
        this.props.setPermissions(permissionsToConsent);
      }
    });

    const tabHeight = convertVhToPx(dimensions.request.height, 110);

    if (loading) {
      return <Label>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>;
    }

    const displayPermissionsPanel = () => {
      return <div data-is-scrollable={true} className={classes.panelContainer}>
        <PanelList
          classes={classes}
          messages={messages}
          selection={selection}
          columns={this.getColumns()}
          renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
            this.renderItemColumn(item, index, column)}
          renderDetailsHeader={this.renderDetailsHeader}
        />
      </div>
    };

    const displayPermissionsAsTab = () => {
      return <TabList
        columns={this.getColumns()}
        maxHeight={tabHeight}
        renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
          this.renderItemColumn(item, index, column)}
        renderDetailsHeader={this.renderDetailsHeader}
        classes={classes}
      />;
    };

    if (panel) {
      return displayPermissionsPanel();
    }

    return displayPermissionsAsTab();
  }
}

function mapStateToProps({ sampleQuery, scopes, authToken, consentedScopes, dimensions, permissionsPanelOpen }: IRootState) {
  return {
    sample: sampleQuery,
    scopes,
    tokenPresent: authToken.token,
    consentedScopes,
    dimensions,
    permissionsPanelOpen
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      ...permissionActionCreators,
    }, dispatch),
  };
}

const styledPermissions = styled(Permission, permissionStyles as any);
// @ts-ignore
const IntlPermission = injectIntl(styledPermissions);
// @ts-ignore
const trackedComponent = telemetry.trackReactComponent(IntlPermission, componentNames.MODIFY_PERMISSIONS_TAB);
export default connect(mapStateToProps, mapDispatchToProps)(trackedComponent);
