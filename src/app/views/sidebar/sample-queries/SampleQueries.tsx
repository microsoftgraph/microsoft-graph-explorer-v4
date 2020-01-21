import {
  DetailsList, DetailsListLayoutMode, DetailsRow, getId,
  IColumn, IconButton, MessageBar, MessageBarType, SearchBox,
  Selection, SelectionMode, Spinner, SpinnerSize, styled, TooltipHost
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQuery, ISampleQueriesProps, ISampleQuery } from '../../../../types/query-runner';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../../services/actions/query-status-action-creator';
import * as samplesActionCreators from '../../../services/actions/samples-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/badge-color';
import { substituteTokens } from '../../../utils/token-helpers';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';

export class SampleQueries extends Component<ISampleQueriesProps, any> {

  constructor(props: ISampleQueriesProps) {
    super(props);
    this.state = {
      groupedList: {
        samples: [],
        categories: [],
      }
    };
  }

  public componentDidMount = () => {
    const { queries } = this.props.samples;
    if (queries && queries.length > 0) {
      this.generateSamples(queries);
    } else {
      this.props.actions!.fetchSamples();
    }
  }

  public componentDidUpdate = (prevProps: ISampleQueriesProps) => {
    if (prevProps.samples.queries !== this.props.samples.queries) {
      this.generateSamples(this.props.samples.queries);
    }
  }

  public searchValueChanged = (value: any): void => {
    const { queries } = this.props.samples;
    const keyword = value.toLowerCase();

    const filteredSamples = queries.filter((sample: any) => {
      const name = sample.humanName.toLowerCase();
      return name.toLowerCase().includes(keyword);
    });

    this.generateSamples(filteredSamples);
  }


  public onDocumentationLinkClicked = (event: any, item: any) => {
    window.open(item.docLink, '_blank');
  };



  public generateSamples(samples: any) {
    const map = new Map();
    const categories: any[] = [];

    let isCollapsed = false;
    let previousCount = 0;
    let count = 0;

    for (const query of samples) {
      if (!map.has(query.category)) {
        map.set(query.category, true);
        count = samples.filter((sample: ISampleQuery) => sample.category === query.category).length;
        if (categories.length > 0) {
          isCollapsed = true;
        }
        categories.push({
          name: query.category,
          key: query.category,
          startIndex: previousCount,
          isCollapsed,
          count,
        });
        previousCount += count;
      }
    }

    this.setState({
      groupedList: {
        samples,
        categories,
      }
    });
  }

  public getToolTipContent(item: any, queryContent: any) {
    let selectionDisabled = false;

    if (!this.props.tokenPresent && item.method !== 'GET') {
      selectionDisabled = true;
    }

    return selectionDisabled ? <FormattedMessage id={'Sign In to try this sample'} /> : queryContent;

  }

  public renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const classes = classNames(this.props);
    const hostId: string = getId('tooltipHost');

    if (column) {
      const queryContent = item[column.fieldName as keyof any] as string;

      const toolTipContent = this.getToolTipContent(item, queryContent);

      switch (column.key) {

        case 'button':
          return <IconButton
            className={classes.docLink}
            iconProps={{ iconName: 'NavigateExternalInline' }}
            title={item.docLink}
            ariaLabel={item.docLink}
            onClick={(event) => this.onDocumentationLinkClicked(event, item)}
          />;

        case 'method':
          return <TooltipHost
            tooltipProps={{ onRenderContent: () => <div style={{ paddingBottom: 3 }}>{toolTipContent}</div> }}
            id={hostId}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: 'inline-block' } }}
          >
            <span className={classes.badge}
              style={{ background: getStyleFor(item.method) }}
            >{item.method}</span>;
          </TooltipHost>;

        default:
          return <span aria-label={queryContent}>
            <TooltipHost
              tooltipProps={{ onRenderContent: () => <div style={{ paddingBottom: 3 }}>{toolTipContent}</div> }}
              id={hostId}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <span aria-label={queryContent} className={classes.queryContent}>
                <FormattedMessage id={queryContent} />
              </span>
            </TooltipHost>
          </span>
            ;
      }
    }
  };

  public renderRow = (props: any): any => {
    const { tokenPresent } = this.props;
    const classes = classNames(this.props);
    let selectionDisabled = false;

    if (props) {
      if (!tokenPresent && props.item.method !== 'GET') {
        selectionDisabled = true;
      }
      return (
        <div className={classes.groupHeader}>
          <DetailsRow
            {...props}
            className={classes.queryRow + ' ' + (selectionDisabled ? classes.rowDisabled : '')}
            data-selection-disabled={selectionDisabled}
          />
        </div>
      );
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

  private renderDetailsHeader() {
    return (
      <div />
    );
  }

  private onToggleCollapse(props: any): () => void {
    return () => {
      props!.onToggleCollapse!(props!.group!);
    };
  }

  public render() {
    const { error, pending } = this.props.samples;
    const {
      intl: { messages },
    }: any = this.props;

    const classes = classNames(this.props);

    if (pending) {
      return (
        <Spinner
          className={classes.spinner}
          size={SpinnerSize.large}
          label={`${messages['loading samples']} ...`}
          ariaLive='assertive'
          labelPosition='top' />
      );
    }

    const { groupedList } = this.state;
    const columns = [
      { key: 'method', name: '', fieldName: 'method', minWidth: 20, maxWidth: 50 },
      { key: 'category', name: '', fieldName: 'humanName', minWidth: 105, maxWidth: 205 },
      { key: 'button', name: '', fieldName: 'button', minWidth: 15, maxWidth: 15, },
    ];

    const selection = new Selection({
      onSelectionChanged: () => {
        const { actions, tokenPresent, profile } = this.props;
        const selectedQuery = selection.getSelection()[0] as any;
        if (!selectedQuery) { return; }

        const queryVersion = selectedQuery.requestUrl.substring(1, 5);
        const sampleQuery: IQuery = {
          sampleUrl: GRAPH_URL + selectedQuery.requestUrl,
          selectedVerb: selectedQuery.method,
          sampleBody: selectedQuery.postBody,
          sampleHeaders: selectedQuery.headers || [],
          selectedVersion: queryVersion,
        };

        substituteTokens(sampleQuery, profile);

        if (actions) {
          if (sampleQuery.selectedVerb === 'GET') {
            sampleQuery.sampleBody = JSON.parse('{}');
            if (tokenPresent) {
              if (selectedQuery.tip) { displayTipMessage(actions, selectedQuery); }
              else { actions.runQuery(sampleQuery); }
            } else {
              actions.runQuery(sampleQuery);
            }
          } else {
            sampleQuery.sampleBody = (sampleQuery.sampleBody) ? JSON.parse(sampleQuery.sampleBody) : undefined;
            if (selectedQuery.tip) { displayTipMessage(actions, selectedQuery); }
          }
          actions.setSampleQuery(sampleQuery);
        }
      }
    });

    return (
      <div>
        <SearchBox className={classes.searchBox} placeholder='Search'
          onChange={(value) => this.searchValueChanged(value)}
        />
        <hr />
        {error && <MessageBar messageBarType={MessageBarType.warning}
          isMultiline={true}
          dismissButtonAriaLabel='Close'>
          You are viewing a cached set of samples because of a network connection failure.
        </MessageBar>}
        <DetailsList className={classes.queryList}
          layoutMode={DetailsListLayoutMode.justified}
          onRenderItemColumn={this.renderItemColumn}
          items={groupedList.samples}
          selectionMode={SelectionMode.none}
          columns={columns} groups={groupedList.categories}
          selection={selection}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: this.renderGroupHeader,
          }}
          onRenderRow={this.renderRow}
          onRenderDetailsHeader={this.renderDetailsHeader}
        />
      </div>
    );
  }

}
function displayTipMessage(actions: any, selectedQuery: ISampleQuery) {
  actions.setQueryResponseStatus({
    messageType: MessageBarType.warning,
    statusText: 'Tip',
    status: selectedQuery.tip
  });
}

function mapStateToProps(state: any) {
  return {
    tokenPresent: !!state.authToken,
    profile: state.profile,
    samples: state.samples,
    appTheme: state.theme,
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators({
      ...queryActionCreators,
      ...queryInputActionCreators,
      ...samplesActionCreators,
      ...queryStatusActionCreators,
    }, dispatch),
  };
}

// @ts-ignore
const styledSampleQueries = styled(SampleQueries, sidebarStyles);
// @ts-ignore
const IntlSampleQueries = injectIntl(styledSampleQueries);
export default connect(mapStateToProps, mapDispatchToProps)(IntlSampleQueries);
