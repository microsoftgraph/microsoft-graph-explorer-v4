import {
  ContextualMenuItemType, DetailsList, DetailsRow, getId, getTheme,
  IColumn, IconButton, SearchBox, SelectionMode, styled, TooltipHost
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IHistoryItem, IHistoryProps } from '../../../../types/history';
import { IQuery } from '../../../../types/query-runner';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../../services/actions/query-status-action-creator';
import * as requestHistoryActionCreators from '../../../services/actions/request-history-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';
import { dynamicSort } from './historyUtil';

export class History extends Component<IHistoryProps, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      groupedList: {
        items: [],
        categories: [],
      }
    };
  }


  public componentDidMount = () => {
    this.generateGroupedList(this.props.history);
  }

  public componentDidUpdate = (prevProps: IHistoryProps) => {
    if (prevProps.history !== this.props.history) {
      this.generateGroupedList(this.props.history);
    }
  }

  public searchValueChanged = (value: any): void => {
    const { history } = this.props;
    const keyword = value.toLowerCase();

    const filteredSamples = history.filter((sample: any) => {
      const name = sample.url.toLowerCase();
      return name.toLowerCase().includes(keyword);
    });

    this.generateGroupedList(filteredSamples);
  }

  public formatDate = (date: any) => {
    const year = date.getFullYear();
    let month = (date.getMonth() + 1);
    month = (month < 10 ? '0' : '') + month;
    let day = date.getDate();
    day = (day < 10 ? '0' : '') + day;
    return `${year}-${month}-${day}`;
  }

  public getItems(history: any) {
    const {
      intl: { messages },
    }: any = this.props;

    const items: any[] = [];

    // tslint:disable-next-line:no-string-literal
    const olderText = messages['older'];
    // tslint:disable-next-line:no-string-literal
    const todayText = messages['today'];
    // tslint:disable-next-line:no-string-literal
    const yesterdayText = messages['yesterday'];

    let date = olderText;
    const today = this.formatDate(new Date());
    const yesterdaysDate = new Date(); yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const yesterday = this.formatDate(yesterdaysDate);

    history.forEach((element: any) => {
      if (element.createdAt.includes(today)) {
        date = todayText;
      } else if (element.createdAt.includes(yesterday)) {
        date = yesterdayText;
      }
      element.category = date;
      items.push(element);
    });
    return items.sort(dynamicSort('-createdAt'));
  }

  public generateGroupedList(history: any) {
    const map = new Map();
    const categories: any[] = [];
    const items = this.getItems(history);

    const isCollapsed = false;
    let previousCount = 0;
    let count = 0;

    for (const historyItem of items) {
      if (!map.has(historyItem.category)) {
        map.set(historyItem.category, true);
        count = items.filter((sample: IHistoryItem) => sample.category === historyItem.category).length;
        categories.push({
          name: historyItem.category,
          key: historyItem.category,
          startIndex: previousCount,
          isCollapsed,
          count,
        });
        previousCount += count;
      }
    }

    this.setState({
      groupedList: {
        items,
        categories,
      }
    });
  }

  public renderRow = (props: any): any => {
    const classes = classNames(this.props);
    return (
      <div className={classes.groupHeader}>
        <DetailsRow {...props} className={classes.queryRow} />
      </div>
    );
  };

  public renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const classes = classNames(this.props);
    const hostId: string = getId('tooltipHost');
    const currentTheme = getTheme();

    const {
      intl: { messages },
    }: any = this.props;
    // tslint:disable
    const actionsText = messages['actions'];
    const runQueryText = messages['Run Query'];
    const viewText = messages['view'];
    const removeText = messages['remove'];
    // tslint:enable

    if (column) {
      const queryContent = item[column.fieldName as keyof any] as string;
      let color = currentTheme.palette.green;
      if (item.status > 300) {
        color = currentTheme.palette.red;
      }

      switch (column.key) {

        case 'status':
          return <span style={{ color }} className={classes.badge}>{item.status}</span>;

        case 'button':
          return <IconButton
            className={classes.docLink}
            title='Actions'
            ariaLabel='Actions'
            menuProps={{
              shouldFocusOnMount: true,
              items: [
                {
                  key: 'actions',
                  itemType: ContextualMenuItemType.Header,
                  text: actionsText,
                },
                {
                  key: 'view',
                  text: viewText,
                  iconProps: {
                    iconName: 'View'
                  },
                  onClick: () => this.onViewQuery(item)
                },
                {
                  key: 'runQuery',
                  text: runQueryText,
                  iconProps: {
                    iconName: 'Refresh'
                  },
                  onClick: () => this.onRunQuery(item)
                },
                {
                  key: 'remove',
                  text: removeText,
                  iconProps: {
                    iconName: 'Delete'
                  },
                  onClick: () => this.onDeleteQuery(item)
                },
              ]
            }}
          />;

        default:
          return <>
            <TooltipHost
              content={`${item.method} - ${queryContent}`}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <span aria-labelledby={hostId} className={classes.queryContent}>
                {queryContent.replace(GRAPH_URL, '')}
              </span>
            </TooltipHost>
          </>;
      }
    }
  };

  public renderGroupHeader = (props: any): any => {
    const classes = classNames(this.props);

    return (
      <div aria-label={props.group!.name} onClick={this.onToggleCollapse(props)}>
        <div className={classes.groupHeaderRow}>
          <IconButton
            className={`${classes.pullLeft} ${classes.groupHeaderRowIcon}`}
            iconProps={{ iconName: props.group!.isCollapsed ? 'ChevronRightSmall' : 'ChevronDownSmall' }}
            title={props.group!.isCollapsed ?
              `Expand ${props.group!.name}` : `Collapse ${props.group!.name}`}
            ariaLabel='expand collapse group'
            onClick={() => this.onToggleCollapse(props)}
          />
          <div className={classes.groupTitle}>
            <span>{props.group!.name}</span>
            <span className={classes.headerCount}>({props.group!.count})</span>
          </div>
        </div>
      </div>
    );
  };

  private onToggleCollapse(props: any): () => void {
    return () => {
      props!.onToggleCollapse!(props!.group!);
    };
  }

  private renderDetailsHeader() {
    return (
      <div />
    );
  }

  private onRunQuery = (query: IHistoryItem) => {
    const { actions } = this.props;
    const { sampleUrl, queryVersion } = parseSampleUrl(query.url);
    const sampleQuery: IQuery = {
      sampleUrl,
      selectedVerb: query.method,
      sampleBody: query.body,
      sampleHeaders: query.headers,
      selectedVersion: queryVersion,
    };

    if (actions) {
      if (sampleQuery.selectedVerb === 'GET') {
        sampleQuery.sampleBody = JSON.parse('{}');
      }
      actions.setSampleQuery(sampleQuery);
      actions.runQuery(sampleQuery);
    }
  }


  private onDeleteQuery = (query: IHistoryItem) => {
    const { actions } = this.props;
    if (actions) {
      actions.removeHistoryItem(query);
    }
  }

  private onViewQuery = (query: IHistoryItem) => {
    const { actions } = this.props;
    const { sampleUrl, queryVersion } = parseSampleUrl(query.url);
    const sampleQuery: IQuery = {
      sampleUrl,
      selectedVerb: query.method,
      sampleBody: query.body,
      sampleHeaders: query.headers,
      selectedVersion: queryVersion,
    };
    const { duration, status, statusText } = query;
    if (actions) {
      actions.setSampleQuery(sampleQuery);
      actions.viewHistoryItem({
        body: query.result,
        headers: query.responseHeaders
      });
      actions.setQueryResponseStatus({
        duration,
        ok: status < 300,
        status,
        statusText
      });
    }
  }

  public render() {
    const { groupedList } = this.state;
    const classes = classNames(this.props);
    const columns = [
      { key: 'status', name: '', fieldName: 'status', minWidth: 20, maxWidth: 50 },
      { key: 'url', name: '', fieldName: 'url', minWidth: 100, maxWidth: 200 },
      { key: 'button', name: '', fieldName: '', minWidth: 20, maxWidth: 20, },
    ];

    return (
      <div>
        <SearchBox placeholder='Search' className={classes.searchBox}
          onChange={(value) => this.searchValueChanged(value)}
        />
        <hr />
        {groupedList.items && <DetailsList
          className={classes.queryList}
          onRenderItemColumn={this.renderItemColumn}
          items={groupedList.items}
          columns={columns}
          selectionMode={SelectionMode.none}
          groups={groupedList.categories}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: this.renderGroupHeader,
          }}
          onRenderRow={this.renderRow}
          onRenderDetailsHeader={this.renderDetailsHeader}
        />}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    history: state.history
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      ...queryActionCreators,
      ...queryInputActionCreators,
      ...requestHistoryActionCreators,
      ...queryStatusActionCreators,
    },
      dispatch),
  };
}


// @ts-ignore
const styledHistory = styled(History, sidebarStyles);
// @ts-ignore
const IntlHistory = injectIntl(styledHistory);
export default connect(mapStateToProps, mapDispatchToProps)(IntlHistory);
