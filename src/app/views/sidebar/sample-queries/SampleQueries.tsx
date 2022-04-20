import {
  Announced, DetailsList, DetailsRow, FontSizes, FontWeights, getId,
  getTheme,
  GroupHeader, IColumn, Icon, IDetailsRowStyles, MessageBar, MessageBarType, SearchBox,
  SelectionMode, Spinner, SpinnerSize, styled, TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../../appLocale';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import {
  IQuery,
  ISampleQueriesProps,
  ISampleQuery
} from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { substituteTokens } from '../../../utils/token-helpers';
import { classNames } from '../../classnames';
import { columns, isJsonString, performSearch } from './sample-query-utils';
import { sidebarStyles } from '../Sidebar.styles';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { fetchSamples } from '../../../services/actions/samples-action-creators';
import { setQueryResponseStatus } from '../../../services/actions/query-status-action-creator';
import { runQuery } from '../../../services/actions/query-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { translateMessage } from '../../../utils/translate-messages';

const unstyledSampleQueries = (sampleProps?: ISampleQueriesProps) : JSX.Element => {

  const [selectedQuery, setSelectedQuery] = useState<ISampleQuery | null>(null)
  const { authToken, profile, samples } =
    useSelector((state: IRootState) => state);
  const tokenPresent = !!authToken;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(samples.queries);
  const dispatch = useDispatch();
  const currentTheme = getTheme();

  const { error, pending } = samples;
  const groups = generateGroupsFromList(sampleQueries, 'category');

  const classProps = {
    styles: sampleProps!.styles,
    theme: sampleProps!.theme
  };
  const classes = classNames(classProps);

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

  const renderItemColumn = (
    item: ISampleQuery,
    index: number | undefined,
    column: IColumn | undefined
  ) => {
    if (column) {
      const queryContent = item[column.fieldName as keyof ISampleQuery] as string;
      const signInText = translateMessage('Sign In to try this sample');

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
                onClick={() => onDocumentationLinkClicked(item)}
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
  }

  const renderRow = (props:any): any => {
    let selectionDisabled = false;
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (selectedQuery?.id === props.item.id) {
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
                querySelected(props.item);
              }
              setSelectedQuery(props.item)
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

  const renderGroupHeader = (props:any): any => {
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

  const renderDetailsHeader = () => {
    return <div />;
  }

  if (selectedQuery) {
    const index = groups.findIndex(k => k.key === selectedQuery.category);
    if (index !== -1) {
      groups[index].isCollapsed = false;
    }
  }

  if (pending) {
    return (
      <Spinner
        className={classes.spinner}
        size={SpinnerSize.large}
        label={`${translateMessage('loading samples')} ...`}
        ariaLive='assertive'
        labelPosition='top'
      />
    );
  }

  return (
    <div>
      <SearchBox
        className={classes.searchBox}
        placeholder={translateMessage('Search sample queries')}
        onChange={searchValueChanged}
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
          onRenderItemColumn={renderItemColumn}
          items={sampleQueries}
          selectionMode={SelectionMode.none}
          columns={columns}
          groups={groups}
          groupProps={{
            showEmptyGroups: true,
            onRenderHeader: renderGroupHeader
          }}
          onRenderRow={renderRow}
          onRenderDetailsHeader={renderDetailsHeader}
          onItemInvoked={querySelected}
        />
      </div>
    </div>
  );
}

// @ts-ignore
const SampleQueries = styled(unstyledSampleQueries, sidebarStyles);
export default SampleQueries;
