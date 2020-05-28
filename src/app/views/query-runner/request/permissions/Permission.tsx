import {
  CheckboxVisibility,
  DetailsList,
  DetailsListLayoutMode,
  FontSizes,
  getId,
  IColumn,
  Icon,
  Label,
  PrimaryButton,
  SearchBox,
  Selection,
  SelectionMode,
  styled,
  TooltipHost
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { SortOrder } from '../../../../../types/enums';
import { IPermission, IPermissionProps, IPermissionState } from '../../../../../types/permissions';
import * as permissionActionCreators from '../../../../services/actions/permissions-action-creator';
import { dynamicSort } from '../../../../utils/dynamic-sort';
import { classNames } from '../../../classnames';
import { permissionStyles } from './Permission.styles';
import { generatePermissionGroups } from './util';

export class Permission extends Component<IPermissionProps, IPermissionState> {

  constructor(props: IPermissionProps) {
    super(props);
    this.state = {
      permissions: [],
      groups: [],
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
      const groups = generatePermissionGroups(permissions);
      this.setState({
        permissions,
        groups
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
    || nextState.permissions !== this.state.permissions;
    return shouldUpdate;
  }

  public searchValueChanged = (value: string): void => {
    const { scopes } = this.props;
    const keyword = value.toLowerCase();

    const filteredPermissions = scopes.data.filter((permission: IPermission) => {
      const name = permission.value.toLowerCase();
      return name.includes(keyword);
    });

    const groups = generatePermissionGroups(filteredPermissions);
    this.setState({
      permissions: filteredPermissions,
      groups
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
                root: { display: 'block'}
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
              <span aria-labelledby={hostId} style={{ fontSize: FontSizes.medium}}>
                {content}
              </span>
            </TooltipHost>
          );
      }
    }
  };

  private getColumns = () => {
    const {
      tokenPresent,
      panel,
      intl: { messages },
    }: any = this.props;

    const columns = [
      {
        key: 'value',
        name: messages.Permission,
        fieldName: 'value',
        minWidth: 150,
        maxWidth: 200,
        isResizable: true
      }
    ];

    if (!panel) {
      columns.push(
        {
          key: 'consentDisplayName',
          name: messages['Display string'],
          fieldName: 'consentDisplayName',
          isResizable: true,
          minWidth: 250,
          maxWidth: 300
        },
        {
          key: 'consentDescription',
          name: messages.Description,
          fieldName: 'consentDescription',
          isResizable: true,
          minWidth: (tokenPresent) ? 400 : 650,
          maxWidth: (tokenPresent) ? 500 : 700
        }
      );
    }

    columns.push(
      {
        key: 'isAdmin',
        isResizable: true,
        name: messages['Admin consent required'],
        fieldName: 'isAdmin',
        minWidth: (tokenPresent) ? 150 : 100,
        maxWidth: (tokenPresent) ? 150 : 100,
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

  private renderList = () => {
    const {
      panel,
      tokenPresent,
      consentedScopes,
      intl: { messages },
    }: any = this.props;
    let { permissions } = this.state;
    const classes = classNames(this.props);
    const columns = this.getColumns();

    if (tokenPresent) {
      permissions.forEach((permission: IPermission) => {
        if (consentedScopes.indexOf(permission.value) !== -1) {
          permission.consented = true;
        }
      });
    }

    if (panel) {

      if (permissions.length > 0) {
        permissions = (panel) ? permissions.sort(dynamicSort('value', SortOrder.ASC)) : permissions;
      }

      const groups = generatePermissionGroups(permissions);
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
        <>
          <Label className={classes.permissionText}>
            <FormattedMessage id='Select different permissions' />
          </Label>
          <hr />
          <SearchBox className={classes.searchBox} placeholder={messages['Search permissions']}
            onChange={(value) => this.searchValueChanged(value)}
            styles={{ field: { paddingLeft: 10 } }}
          />
          <hr />
          <DetailsList
            items={permissions}
            columns={columns}
            groups={groups}
            onRenderItemColumn={this.renderItemColumn}
            selectionMode={SelectionMode.multiple}
            layoutMode={DetailsListLayoutMode.justified}
            selection={selection}
            compact={true}
            groupProps={{
              showEmptyGroups: false,
            }}
            ariaLabelForSelectionColumn='Toggle selection'
            ariaLabelForSelectAllCheckbox='Toggle selection for all items'
            checkButtonAriaLabel='Row checkbox'
            />
        </>
      );
    }
    return (
      <>
        <Label className={classes.permissionLength}>
          <FormattedMessage id='Permissions' />&nbsp;({permissions.length})
        </Label>
        <Label className={classes.permissionText}>
          <FormattedMessage id='permissions required to run the query' />
        </Label>
        <DetailsList styles={{ root: { minHeight: '300px'}}}
          items={permissions}
          columns={columns}
          onRenderItemColumn={this.renderItemColumn}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
        />
      </>
    );
  }

  public render() {
    const classes = classNames(this.props);
    const { panel, scopes } = this.props;
    const { pending: loading } = scopes;
    const { permissions } = this.state;

    return (
      <div className={classes.container}  style={{ minHeight: (panel) ? '800px' : '300px' }}>
        {loading && <Label>
          <FormattedMessage id={'Fetching permissions'} />...
        </Label>}
        {permissions && permissions.length > 0 && !loading &&
          <div className={classes.permissions}>
            {this.renderList()}
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
