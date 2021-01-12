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

import { IPermission, IPermissionProps, IPermissionState } from '../../../../../types/permissions';
import * as permissionActionCreators from '../../../../services/actions/permissions-action-creator';
import { translateMessage } from '../../../../utils/translate-messages';
import { classNames } from '../../../classnames';
import PanelList from './PanelList';
import { permissionStyles } from './Permission.styles';
import TabList from './TabList';
import { setConsentedStatus } from './util';

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
    if (prevProps.sample !== this.props.sample) {
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
    const { panel, sample } = this.props;
    if (panel) {
      this.props.actions!.fetchScopes();
    }
    else {
      this.props.actions!.fetchScopes(sample);
    }
  }

  public shouldComponentUpdate(nextProps: IPermissionProps, nextState: IPermissionState) {
    const shouldUpdate = nextProps.sample !== this.props.sample
      || nextProps.scopes !== this.props.scopes
      || nextProps.consentedScopes !== this.props.consentedScopes
      || nextState.permissions !== this.state.permissions;
    return shouldUpdate;
  }

  public searchValueChanged = (event: any, value?: string): void => {
    const { scopes } = this.props;
    let filteredPermissions = scopes.data;
    if (value) {
      const keyword = value.toLowerCase();

      filteredPermissions = scopes.data.filter((permission: IPermission) => {
        const name = permission.value.toLowerCase();
        return name.includes(keyword);
      });
    }

    this.setState({
      permissions: filteredPermissions
    });
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
              <Icon iconName='checkmark' className={classes.checkIcon} />
            </div>;
          } else {
            return <div style={{ textAlign: 'center' }}>
              <Icon iconName='StatusCircleErrorX' className={classes.checkIcon} />
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
        isResizable: true
      }
    ];

    if (!panel) {
      columns.push(
        {
          key: 'consentDescription',
          name: messages.Description,
          fieldName: 'consentDescription',
          isResizable: true,
          minWidth: (tokenPresent) ? 400 : 700,
          maxWidth: (tokenPresent) ? 700 : 1000,
          isMultiline: true
        }
      );
    }

    columns.push(
      {
        key: 'isAdmin',
        isResizable: true,
        name: messages['Admin consent required'],
        fieldName: 'isAdmin',
        minWidth: (tokenPresent) ? 150 : 150,
        maxWidth: (tokenPresent) ? 200 : 300,
        ariaLabel: translateMessage('Administrator permission')
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
    const { panel, scopes, tokenPresent, consentedScopes } = this.props;
    const { pending: loading } = scopes;
    const { permissions } = this.state;

    const {
      intl: { messages },
    }: any = this.props;

    setConsentedStatus(tokenPresent, permissions, consentedScopes);

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

    return (
      <div className={panel ? classes.panelContainer : classes.container}
        style={{ minHeight: (panel) ? '800px' : '300px' }}>
        {loading && <Label>
          <FormattedMessage id={'Fetching permissions'} />...
        </Label>}
        {!loading &&
          <div className={classes.permissions}>
            {!panel && <TabList
              permissions={permissions}
              columns={this.getColumns()}
              classes={classes}
              renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
                this.renderItemColumn(item, index, column)}
              renderDetailsHeader={this.renderDetailsHeader}

            />}
            {panel &&
              <div data-is-scrollable={true}>
                <PanelList
                  classes={classes}
                  permissions={permissions}
                  messages={messages}
                  selection={selection}
                  columns={this.getColumns()}
                  renderItemColumn={(item?: any, index?: number, column?: IColumn) =>
                    this.renderItemColumn(item, index, column)}
                  searchValueChanged={(event?: React.ChangeEvent<HTMLInputElement>, value?: string) =>
                    this.searchValueChanged(event, value)}
                  renderDetailsHeader={this.renderDetailsHeader}
                />
              </div>
            }
          </div>
        }
        {permissions && permissions.length === 0 && !loading &&
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
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sample: state.sampleQuery,
    scopes: state.scopes,
    tokenPresent: state.authToken,
    consentedScopes: state.consentedScopes
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
export default connect(mapStateToProps, mapDispatchToProps)(IntlPermission);
