import { DetailsList, DetailsRow, IColumn,
  IconButton, SearchBox, SelectionMode, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IHistoryItem, IHistoryProps } from '../../../../types/history';
import { GRAPH_URL } from '../../../services/graph-constants';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';

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

  public getItems (history: any) {
    const items: any[] = [];
    let date = 'Older';
    const today = this.formatDate(new Date());
    const yesterdaysDate = new Date(); yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
    const yesterday = this.formatDate(yesterdaysDate);

    history.forEach((element: any) => {
      if (element.createdAt.includes(today)) {
        date = 'Today';
      } else if (element.createdAt.includes(yesterday)) {
        date = 'Yesterday';
      }
      element.category = date;
      items.push(element);
    });
    return items;
  }

  public generateGroupedList(history: any) {
    const map = new Map();
    const categories: any[] = [];
    const items = this.getItems(history);

    let isCollapsed = false;
    let previousCount = 0;
    let count = 0;

    for (const historyItem of items) {
      if (!map.has(historyItem.category)) {
        map.set(historyItem.category, true);
        count = items.filter((sample: IHistoryItem) => sample.category === historyItem.category).length;
        if (categories.length > 0) {
          isCollapsed = true;
        }
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
      }});
  }

  public renderRow = (props: any): any => {
    const classes = classNames(this.props);

    return (
      <div className={classes.groupHeader}>
        <DetailsRow {...props} className={classes.queryRow}/>
      </div>
    );
  };

  public renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const classes = classNames(this.props);

    if (column) {
      const queryContent = item[column.fieldName as keyof any] as string;

      switch (column.key) {

        case 'method':
          return <span className={classes.badge}>{item.method}</span>;

        case 'status':
          return <span title={item.status} className={classes.docLink}>
            {item.status}
          </span>;

        default:
          return <span title={queryContent} className={classes.queryContent}>
            {queryContent.replace(GRAPH_URL, '')}
          </span>;
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

  public render() {
    const { groupedList } = this.state;
    const classes = classNames(this.props);
    const columns = [
      { key: 'method', name: 'method', fieldName: 'method', minWidth: 20, maxWidth: 50 },
      { key: 'url', name: 'Url', fieldName: 'url', minWidth: 100, maxWidth: 200 },
      { key: 'status', name: 'Status', fieldName: 'status', minWidth: 20, maxWidth: 20, },
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

export default connect(mapStateToProps, null)(styled(History, sidebarStyles));
