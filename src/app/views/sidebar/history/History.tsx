import { DetailsList, SearchBox, Selection } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IHistoryItem } from '../../../../types/history';

export class History extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      groupedList: {
        requestHistory: [],
        categories: [],
      }
    };
  }


  public componentDidMount = () => {
    const groupedList = this.generateGroupedList(this.props.requestHistory);
    this.setState({ groupedList });
  }

  public searchValueChanged = (value: any): void => {
    const { requestHistory } = this.props;
    const keyword = value.toLowerCase();

    const filteredSamples = requestHistory.filter((sample: any) => {
      const name = sample.url.toLowerCase();
      return name.toLowerCase().includes(keyword);
    });

    const groupedList = this.generateGroupedList(filteredSamples);
    this.setState({ groupedList });
  }

  public getItems (requestHistory: any) {
    const items: any[] = [];
    requestHistory.forEach((element: any) => {
      element.category = 'Today';
      items.push(element);
    });
    return items;
  }

  public generateGroupedList(requestHistory: any) {
    const map = new Map();
    const categories: any[] = [];
    const items = this.getItems(requestHistory);

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
    return {
      items,
      categories,
    };
  }

  public render() {
    const { groupedList } = this.state;
    const columns = [
      { key: 'method', name: 'method', fieldName: 'method', minWidth: 20, maxWidth: 50 },
      { key: 'url', name: 'Url', fieldName: 'url', minWidth: 100, maxWidth: 200 },
      { key: 'date', name: 'Date', fieldName: 'runTime', minWidth: 20, maxWidth: 20, },
      { key: 'status', name: 'Status', fieldName: 'status', minWidth: 20, maxWidth: 20, },
    ];

    const selection = new Selection({
      onSelectionChanged: () => {
        const selectedQuery = selection.getSelection()[0] as any;
        // tslint:disable-next-line:no-console
        console.log(selectedQuery);
      }
    });


    return (
      <div>
        <SearchBox placeholder='Search'
          onChange={(value) => this.searchValueChanged(value)}
        />
        <hr />
        {groupedList.items && <DetailsList
          items={groupedList.items}
          columns={columns}
          selection={selection}
          groups={groupedList.categories}
          groupProps={{
            showEmptyGroups: true,
          }}
        />}
      </div>
    );
  }
}


function mapStateToProps(state: any) {
  return {
    requestHistory: state.requestHistory
  };
}

export default connect(mapStateToProps, null)(History);


