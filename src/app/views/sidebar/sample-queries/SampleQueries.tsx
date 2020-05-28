import {
  DetailsList, DetailsListLayoutMode, DetailsRow, FontSizes,
  FontWeights, getId, GroupHeader, IColumn, IconButton,
  MessageBar, MessageBarType, SearchBox, Selection, SelectionMode, Spinner, SpinnerSize, styled, TooltipHost
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { geLocale } from '../../../../appLocale';
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
      const category = sample.category.toLowerCase();
      return name.includes(keyword) || category.includes(keyword);
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

  public renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    const classes = classNames(this.props);
    const {
      tokenPresent,
      intl: { messages },
    }: any = this.props;

    if (column) {
      const queryContent = item[column.fieldName as keyof any] as string;

      switch (column.key) {
        case 'authRequiredIcon':
          if (item.method !== 'GET' && !tokenPresent) {
            const signInText = messages['Sign In to try this sample'];
            return <TooltipHost
              tooltipProps={{
                onRenderContent: () => <div style={{ paddingBottom: 3 }}>
                  <FormattedMessage id={'Sign In to try this sample'} /></div>
              }}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <IconButton
                className={classes.docLink}
                iconProps={{ iconName: 'Lock' }}
                title={signInText}
                ariaLabel={signInText}
              />
            </TooltipHost>;
          }
          return null;

        case 'button':
          return <TooltipHost
            tooltipProps={{
              onRenderContent: () => <div style={{ paddingBottom: 3 }}>
                {item.docLink}</div>
            }}
            id={getId()}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: 'inline-block' } }}
          >
            <IconButton
              style={{ marginTop: '-7.5%' }}
              iconProps={{ iconName: 'NavigateExternalInline' }}
              title={item.docLink}
              ariaLabel={item.docLink}
              onClick={(event) => this.onDocumentationLinkClicked(event, item)}
            />
          </TooltipHost>;

        case 'method':
          return <TooltipHost
            tooltipProps={{
              onRenderContent: () => <div style={{ paddingBottom: 3 }}>
                {queryContent}</div>
            }}
            id={getId()}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: 'inline-block' } }}
          >
            <span className={classes.badge}
              style={{ background: getStyleFor(item.method) }}
            >{item.method}</span>;
          </TooltipHost>;

        default:
          return <TooltipHost
              tooltipProps={{
                onRenderContent: () => <div style={{ paddingBottom: 3 }}>
                  {item.method} {queryContent} </div>
              }}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <span aria-label={queryContent} className={classes.queryContent}>
                {queryContent}
              </span>
            </TooltipHost>;
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
    const onToggleSelectGroup = () => {
      props.onToggleCollapse(props.group);
    };

    return (
      <GroupHeader
        compact={true}
        styles={{
          check: { display: 'none' },
          title: {
          fontSize: FontSizes.medium,
          fontWeight: FontWeights.semibold
        },
        expand: {
          fontSize: FontSizes.small,
          }
        }}
        {...props}
        onToggleSelectGroup={onToggleSelectGroup}
      />
    );
  }

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
      { key: 'authRequiredIcon', name: '', fieldName: 'authRequiredIcon', minWidth: 14, maxWidth: 15 },
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
        <SearchBox className={classes.searchBox} placeholder={messages['Search sample queries']}
          onChange={(value) => this.searchValueChanged(value)}
          styles={{ field: { paddingLeft: 10 } }}
        />
        <hr />
        {error && <MessageBar messageBarType={MessageBarType.warning}
          isMultiline={true}
          dismissButtonAriaLabel='Close'>
          <FormattedMessage id='viewing a cached set' />
        </MessageBar>}
        <MessageBar messageBarType={MessageBarType.info}
          isMultiline={false}
          dismissButtonAriaLabel='Close'>
          <FormattedMessage id='see more queries' />
          <a target='_blank'
            href={`https://docs.microsoft.com/${geLocale}/graph/api/overview?view=graph-rest-1.0`}>
            <FormattedMessage id='Microsoft Graph API Reference docs' />
          </a>
        </MessageBar>
        <DetailsList className={classes.queryList}
         cellStyleProps={{
          cellRightPadding: 0,
          cellExtraRightPadding: 0,
          cellLeftPadding: 0,
        }}
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
