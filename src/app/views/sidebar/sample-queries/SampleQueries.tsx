import {
  Announced, DetailsList, DetailsRow, FontSizes, FontWeights, getId,
  getTheme,
  GroupHeader, IColumn, Icon, IDetailsRowStyles, MessageBar, MessageBarType, SearchBox,
  SelectionMode, Spinner, SpinnerSize, styled, TooltipHost
} from '@fluentui/react';
import React, { Component, useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { geLocale } from '../../../../appLocale';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import {
  IQuery,
  ISampleQueriesProps,
  ISampleQuery
} from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
import * as queryStatusActionCreators from '../../../services/actions/query-status-action-creator';
import * as samplesActionCreators from '../../../services/actions/samples-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { substituteTokens } from '../../../utils/token-helpers';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';
import { columns, isJsonString, performSearch } from './sample-query-utils';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { fetchSamples } from '../../../services/actions/samples-action-creators';
import { setQueryResponseStatus } from '../../../services/actions/query-status-action-creator';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';

function SampleQueries() {

  const [selectedQuery, setSelectedQuery] = useState<ISampleQuery | null>(null)
  const { authToken, profile, samples, theme } =
    useSelector((state: IRootState) => state);
  const tokenPresent = !!authToken;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(samples.queries);
  const dispatch = useDispatch();

  useEffect(() => {
    if(samples.queries.length === 0){
      dispatch(fetchSamples());
    }
  }, [])

  const searchValueChanged = (event: any, value?: string): void => {
    const { queries } = samples;
    const filteredQueries = value ? performSearch(queries, value): queries;
    setSampleQueries(filteredQueries);
  };

  const onDocumentationLinkClicked = (item: ISampleQuery) => {
    window.open(item.docLink, '_blank');
    trackDocumentLinkClickedEvent(item);
  };

  const trackDocumentLinkClickedEvent = async (item: ISampleQuery): Promise<void> => {
    const properties: { [key: string]: any } = {
      ComponentName: componentNames.DOCUMENTATION_LINK,
      SampleId: item.id,
      SampleName: item.humanName,
      SampleCategory: item.category,
      Link: item.docLink
    };
    telemetry.trackEvent(eventTypes.LINK_CLICK_EVENT, properties);

    // Check if link throws error
    validateExternalLink(item.docLink || '', componentNames.DOCUMENTATION_LINK, item.id);
  }

  const querySelected = (query: ISampleQuery) => {
    if (!query) {
      return;
    }

    const queryVersion = query.requestUrl.substring(1, 5);
    const sampleQuery: IQuery = {
      sampleUrl: GRAPH_URL + query.requestUrl,
      selectedVerb: query.method,
      sampleBody:  query.postBody,
      sampleHeaders: query.headers || [],
      selectedVersion: queryVersion
    };
    substituteTokens(sampleQuery, profile!);
    sampleQuery.sampleBody = getSampleBody(sampleQuery);

    if (query.tip) {
      displayTipMessage(query);
    }

    if (shouldRunQuery(query)) {
      dispatch(runQuery(sampleQuery));
    }

    trackSampleQueryClickEvent(query);
    dispatch(setSampleQuery(sampleQuery));
  };

  const getSampleBody = (query : IQuery) => {
    return query.sampleBody ? (isJsonString(query.sampleBody)
      ? JSON.parse(query.sampleBody)
      : query.sampleBody) : undefined;
  }

  const displayTipMessage = (query: ISampleQuery) => {
    dispatch(setQueryResponseStatus({
      messageType: MessageBarType.warning,
      statusText: 'Tip',
      status: query.tip
    }));
  }

  const shouldRunQuery = (query: ISampleQuery) => {
    if(query.tip && tokenPresent) {
      return false;
    }
    if(!tokenPresent || query.method === 'GET'){
      return true;
    }
    return false;
  }

  const trackSampleQueryClickEvent = (query: ISampleQuery) => {
    const sanitizedUrl = sanitizeQueryUrl(GRAPH_URL + query.requestUrl);
    telemetry.trackEvent(
      eventTypes.LISTITEM_CLICK_EVENT,
      {
        ComponentName: componentNames.SAMPLE_QUERY_LIST_ITEM,
        SampleId: query.id,
        SampleName: query.humanName,
        SampleCategory: query.category,
        QuerySignature: `${query.method} ${sanitizedUrl}`
      });
  }

  return (
    <div>
      <SearchBox
        className={classes.searchBox}
        placeholder={messages['Search sample queries']}
        onChange={this.searchValueChanged}
        styles={searchBoxStyles}
        aria-label={'Search'}
      />
      <hr />
      {error && (
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={true}
          dismissButtonAriaLabel='Close'
        >
          <FormattedMessage id='viewing a cached set' />
        </MessageBar>
      )}
      <MessageBar
        messageBarType={MessageBarType.info}
        isMultiline={true}
        dismissButtonAriaLabel='Close'
      >
        <FormattedMessage id='see more queries' />
        <a
          target='_blank'
          rel="noopener noreferrer"
          className={classes.links}
          onClick={(e) => telemetry.trackLinkClickEvent(e.currentTarget.href,
            componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK)}
          href={`https://docs.microsoft.com/${geLocale}/graph/api/overview?view=graph-rest-1.0`}
        >
          <FormattedMessage id='Microsoft Graph API Reference docs' />
        </a>
      </MessageBar>
      <Announced
        message={`${sampleQueries.length} search results available.`}
      />
      <div role="navigation">
        <DetailsList
          className={classes.queryList}
          cellStyleProps={{
            cellRightPadding: 0,
            cellExtraRightPadding: 0,
            cellLeftPadding: 0
          }}
          onRenderItemColumn={this.renderItemColumn}
          items={sampleQueries}
          selectionMode={SelectionMode.none}
          columns={columns}
          groups={groups}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: this.renderGroupHeader
          }}
          onRenderRow={this.renderRow}
          onRenderDetailsHeader={this.renderDetailsHeader}
          onItemInvoked={this.querySelected}
        />
      </div>
    </div>
  );
}

export default SampleQueries
export class SampleQueriess extends Component<ISampleQueriesProps, any> {
  constructor(props: ISampleQueriesProps) {
    super(props);
    this.state = {
      sampleQueries: [],
      selectedQuery: null
    };
  }

  public renderItemColumn = (
    item: ISampleQuery,
    index: number | undefined,
    column: IColumn | undefined
  ) => {
    const classes = classNames(this.props);
    const {
      tokenPresent,
      intl: { messages }
    }: any = this.props;

    if (column) {
      const queryContent = item[column.fieldName as keyof ISampleQuery] as string;
      const signInText = messages['Sign In to try this sample'];

      switch (column.key) {
        case 'authRequiredIcon':
          if (item.method !== 'GET' && !tokenPresent) {
            return (
              <TooltipHost
                tooltipProps={{
                  onRenderContent: () => (
                    <div style={{ paddingBottom: 3 }}>
                      <FormattedMessage id={signInText} />
                    </div>
                  )
                }}
                id={getId()}
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <Icon
                  iconName='Lock'
                  title={signInText}
                  style={{
                    fontSize: 15,
                    height: 10,
                    width: 10,
                    verticalAlign: 'center',
                    paddingTop: 2,
                    paddingRight: 1
                  }}
                />
              </TooltipHost>
            );
          } else {
            return null;
          }

        case 'button':
          return (
            <TooltipHost
              tooltipProps={{
                onRenderContent: () => (
                  <div
                    style={{ paddingBottom: 3 }}>
                    {item.docLink}
                  </div>
                )
              }}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
            >
              <Icon
                iconName='TextDocument'
                onClick={() => this.onDocumentationLinkClicked(item)}
                className={classes.docLink}
                style={{
                  marginRight: '45%',
                  width: 10
                }}
              />
            </TooltipHost>
          );

        case 'method':
          return (
            <TooltipHost
              tooltipProps={{
                onRenderContent: () => (
                  <div style={{ paddingBottom: 3 }}>{queryContent}</div>
                )
              }}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <span
                className={classes.badge}
                style={{
                  background: getStyleFor(item.method),
                  textAlign: 'center'
                }}
              >
                {item.method}
              </span>
            </TooltipHost>
          );

        default:
          return (
            <TooltipHost
              tooltipProps={{
                onRenderContent: () => (
                  <div style={{ paddingBottom: 3 }}>
                    {item.method} {queryContent}{' '}
                  </div>
                )
              }}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
            >
              <span aria-label={queryContent} className={classes.queryContent}>
                {queryContent}
              </span>
            </TooltipHost>
          );
      }
    }
  };

  public renderRow = (props: any): any => {
    const currentTheme = getTheme();
    const { tokenPresent } = this.props;
    const classes = classNames(this.props);
    let selectionDisabled = false;
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (this.state.selectedQuery?.id === props.item.id) {
      customStyles.root = { backgroundColor: currentTheme.palette.neutralLight };
    }

    if (props) {
      if (!tokenPresent && props.item.method !== 'GET') {
        selectionDisabled = true;
      }
      return (
        <div className={classes.groupHeader}>
          <DetailsRow
            {...props}
            styles={customStyles}
            onClick={() => {
              if (!selectionDisabled) {
                this.querySelected(props.item);
              }
              this.setState({ selectedQuery: props.item })
            }}
            className={
              classes.queryRow +
              ' ' +
              (selectionDisabled ? classes.rowDisabled : '')
            }
            data-selection-disabled={selectionDisabled}
            getRowAriaLabel={() => props.item.method.toLowerCase() + props.item.humanName}
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
            fontSize: FontSizes.small
          }
        }}
        {...props}
        onToggleSelectGroup={onToggleSelectGroup}
      />
    );
  };

  private renderDetailsHeader() {
    return <div />;
  }

  public render() {
    const { error, pending } = this.props.samples;
    const {
      intl: { messages }
    }: any = this.props;

    const { sampleQueries } = this.state;
    const classes = classNames(this.props);
    const groups = generateGroupsFromList(sampleQueries, 'category');
    if (this.state.selectedQuery) {
      const index = groups.findIndex(k => k.key === this.state.selectedQuery.category);
      if (index !== -1) {
        groups[index].isCollapsed = false;
      }
    }

    if (pending) {
      return (
        <Spinner
          className={classes.spinner}
          size={SpinnerSize.large}
          label={`${messages['loading samples']} ...`}
          ariaLive='assertive'
          labelPosition='top'
        />
      );
    }
  }
}

function displayTipMessage(actions: any, selectedQuery: ISampleQuery) {
  actions.setQueryResponseStatus({
    messageType: MessageBarType.warning,
    statusText: 'Tip',
    status: selectedQuery.tip
  });
}

function mapStateToProps({ authToken, profile, samples, theme }: IRootState) {
  return {
    tokenPresent: !!authToken.token,
    profile,
    samples,
    appTheme: theme
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        ...queryActionCreators,
        ...queryInputActionCreators,
        ...samplesActionCreators,
        ...queryStatusActionCreators
      },
      dispatch
    )
  };
}

// @ts-ignore
const styledSampleQueries = styled(SampleQueries, sidebarStyles);
// @ts-ignore
const IntlSampleQueries = injectIntl(styledSampleQueries);
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(IntlSampleQueries);
