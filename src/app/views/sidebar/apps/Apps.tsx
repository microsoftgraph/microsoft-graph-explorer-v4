import { driver } from 'localforage';
import {
  Announced,
  ContextualMenuItemType, DefaultButton, DetailsList, DetailsRow, Dialog,
  DialogFooter, DialogType, getId, getTheme, IColumn, IconButton,
  Label, MessageBar, MessageBarType, PrimaryButton, SearchBox, SelectionMode, styled, TooltipHost, ActionButton, Icon
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IRootState } from '../../../../types/root';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../../services/actions/query-status-action-creator';
import * as requestHistoryActionCreators from '../../../services/actions/request-history-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';

export class Apps extends Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {
      appItems: [],
    };
  }

  public renderRow = (props: any): any => {
    const classes = classNames(this.props);
    return (
      <div className={classes.groupHeader}>
        <DetailsRow
          {...props}
          className={classes.queryRow}
        />
      </div>
    );
  };

  public renderItemColumn = (
    item: any,
    index: number | undefined,
    column: IColumn | undefined
  ) => {
    const classes = classNames(this.props);
    const hostId: string = getId('tooltipHost');
    const currentTheme = getTheme();

    const {
      intl: { messages },
    }: any = this.props;
    // tslint:disable
    const actionsText = messages.actions;
    // tslint:enable

    if (column) {
      const queryContent = item[column.fieldName as keyof any] as string;
      let color = currentTheme.palette.green;
      if (item.status > 300) {
        color = currentTheme.palette.red;
      }

      switch (column.key) {
        case 'status':
          return (
            <span style={{ color }} className={classes.badge}>
              {item.status}
            </span>
          );

        case 'button':
          const buttonActions = [
            {
              key: 'actions',
              itemType: ContextualMenuItemType.Header,
              text: actionsText,
            },
          ];

          return (
            <IconButton
              className={classes.docLink}
              title='Actions'
              ariaLabel='Actions'
              menuIconProps={{ iconName: 'More' }}
              menuProps={{
                shouldFocusOnMount: true,
                items: buttonActions,
              }}
            />
          );

        default:
          return (
            <>
              <TooltipHost
                content={`${item.method} - ${queryContent}`}
                id={hostId}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <span
                  aria-describedby={hostId}
                  className={classes.queryContent}
                >
                  {queryContent.replace(GRAPH_URL, '')}
                </span>
              </TooltipHost>
            </>
          );
      }
    }
  };

  public renderGroupHeader = (props: any): any => {
    const classes = classNames(this.props);
    const {
      intl: { messages },
    }: any = this.props;

    // tslint:disable
    const expandText = messages.Expand;
    const collapseText = messages.Collapse;
    // tslint:enable

    return (
      <div
        aria-label={props.group!.name}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={'col-md-8'}>
          <div
            className={classes.groupHeaderRow}
            onClick={this.onToggleCollapse(props)}
          >
            <IconButton
              className={`${classes.pullLeft} ${classes.groupHeaderRowIcon}`}
              iconProps={{
                iconName: props.group!.isCollapsed
                  ? 'ChevronRightSmall'
                  : 'ChevronDownSmall',
              }}
              title={
                props.group!.isCollapsed
                  ? `${expandText} ${props.group!.name}`
                  : `${collapseText} ${props.group!.name}`
              }
              ariaLabel='expand collapse group'
              onClick={() => this.onToggleCollapse(props)}
            />
            <div className={classes.groupTitle}>
              <span>{props.group!.name}</span>
              <span className={classes.headerCount}>
                ({props.group!.count})
              </span>
            </div>
          </div>
        </div>
        <div className={'col-md-4'} style={{ display: 'inline-block' }}>
          <IconButton
            className={`${classes.pullRight} ${classes.groupHeaderRowIcon}`}
            iconProps={{ iconName: 'Delete' }}
            title={`${messages['Delete requests']} : ${props.group!.name}`}
            ariaLabel='delete group'
            onClick={() => this.showDialog(props.group!.name)}
          />
        </div>
      </div>
    );
  };

  private onToggleCollapse(props: any): () => void {
    return () => {
      props!.onToggleCollapse!(props!.group!);
    };
  }

  private showDialog = (category: string): void => {
    this.setState({ hideDialog: false, category });
  };

  private closeDialog = (): void => {
    this.setState({ hideDialog: true, category: '' });
  };

  public searchValueChanged = (event: any, value?: string): void => {
    const { history } = this.props;
    let historyItems = history;
    if (value) {
      const keyword = value.toLowerCase();
      historyItems = history.filter((sample: any) => {
        const name = sample.url.toLowerCase();
        return name.toLowerCase().includes(keyword);
      });
    }

    this.setState({ historyItems });
  }
  public render() {

    return (
      <>
        <div>
          <hr />
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={true}
            dismissButtonAriaLabel='Close'
          >
            <FormattedMessage id='These are the apps you can login as' />
            .
          </MessageBar>
          <ActionButton style={{ display: 'block', margin: 'auto', backgroundColor: "#0078d4", color: "white", marginBottom: 10 }}  >Test App 1</ActionButton>
          <ActionButton style={{ display: 'block', margin: 'auto', backgroundColor: "#0078d4", color: "white", marginBottom: 10 }} >Test App 2</ActionButton>
          <ActionButton style={{ display: 'block', margin: 'auto', backgroundColor: "#0078d4", color: "white", marginBottom: 10 }} >Test App 3</ActionButton>
        </div>
      </>
    );
  }
}

function mapStateToProps({ apps }: any) {
  return {
    a: apps
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    submitNewApp: (app: any) => {
      dispatch(app);
    }
  };
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Apps);
