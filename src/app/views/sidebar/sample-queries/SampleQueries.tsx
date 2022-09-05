import {
  Announced, DetailsList, DetailsRow, FontSizes, FontWeights, getId,
  getTheme,
  GroupHeader, IColumn, Icon, IDetailsRowStyles, IGroup, Link, MessageBar, MessageBarType, SearchBox,
  SelectionMode, Spinner, SpinnerSize, styled, TooltipHost
} from '@fluentui/react';
import React, { useEffect, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { geLocale } from '../../../../appLocale';
import { componentNames, telemetry } from '../../../../telemetry';
import {
  IQuery,
  ISampleQueriesProps,
  ISampleQuery
} from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { substituteTokens } from '../../../utils/token-helpers';
import { classNames } from '../../classnames';
import {
  columns, isJsonString, performSearch, trackDocumentLinkClickedEvent,
  trackSampleQueryClickEvent
} from './sample-query-utils';
import { sidebarStyles } from '../Sidebar.styles';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { fetchSamples } from '../../../services/actions/samples-action-creators';
import { setQueryResponseStatus } from '../../../services/actions/query-status-action-creator';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { translateMessage } from '../../../utils/translate-messages';
import { NoResultsFound } from '../sidebar-utils/SearchResult';

const unstyledSampleQueries = (sampleProps?: ISampleQueriesProps): JSX.Element => {

  const [selectedQuery, setSelectedQuery] = useState<ISampleQuery | null>(null)
  const { authToken, profile, samples } =
    useSelector((state: IRootState) => state);
  const tokenPresent = authToken.token;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(samples.queries);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState<boolean>(false);
  const dispatch = useDispatch();
  const currentTheme = getTheme();

  const { error, pending } = samples;

  const classProps = {
    styles: sampleProps!.styles,
    theme: sampleProps!.theme
  };
  const classes = classNames(classProps);

  const shouldGenerateGroups = useRef(true);

  useEffect(() => {
    if (samples.queries.length === 0) {
      dispatch(fetchSamples());
    } else {
      setSampleQueries(samples.queries)
    }
  }, [samples.queries, tokenPresent])

  useEffect(() => {
    if (shouldGenerateGroups.current) {
      setGroups(generateGroupsFromList(sampleQueries, 'category'));
      if(groups && groups.length > 0){
        shouldGenerateGroups.current = false;
      }
    }
  }, [sampleQueries, searchStarted]);

  const searchValueChanged = (_event: any, value?: string): void => {
    shouldGenerateGroups.current = true;
    setSearchStarted(searchStatus => !searchStatus);
    const { queries } = samples;
    const filteredQueries = value ? performSearch(queries, value) : queries;
    setSampleQueries(filteredQueries);
  };

  const onDocumentationLinkClicked = (item: ISampleQuery) => {
    window.open(item.docLink, '_blank');
    trackDocumentLinkClickedEvent(item);
  };

  const querySelected = (query: ISampleQuery) => {
    const queryVersion = query.requestUrl.substring(1, 5);
    const sampleQuery: IQuery = {
      sampleUrl: GRAPH_URL + query.requestUrl,
      selectedVerb: query.method,
      sampleBody: query.postBody,
      sampleHeaders: query.headers || [],
      selectedVersion: queryVersion
    };
    substituteTokens(sampleQuery, profile!);
    sampleQuery.sampleBody = getSampleBody(sampleQuery);

    if (query.tip) {
      displayTipMessage(query);
    }

    trackSampleQueryClickEvent(query);
    dispatch(setSampleQuery(sampleQuery));
  };

  const getSampleBody = (query: IQuery) => {
    return query.sampleBody ? parseSampleBody() : undefined;

    function parseSampleBody() {
      return isJsonString(query.sampleBody!)
        ? JSON.parse(query.sampleBody!)
        : query.sampleBody;
    }
  }

  const displayTipMessage = (query: ISampleQuery) => {
    dispatch(setQueryResponseStatus({
      messageType: MessageBarType.warning,
      statusText: 'Tip',
      status: query.tip
    }));
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
                  textAlign: 'center',
                  position: 'relative',
                  right: '5px'
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

  const renderRow = (props: any): any => {
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
                const query: ISampleQuery = props.item!;
                querySelected(query);
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

  const renderGroupHeader = (props: any): any => {
    return (
      <GroupHeader
        {...props}
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
      />
    );
  };

  const renderDetailsHeader = () => {
    return <div />;
  }

  if (pending && groups.length === 0) {
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
        <Link
          target='_blank'
          rel="noopener noreferrer"
          onClick={(e) => telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK)}
          href={`https://docs.microsoft.com/${geLocale}/graph/api/overview?view=graph-rest-1.0`}
        >
          <FormattedMessage id='Microsoft Graph API Reference docs' />
        </Link>
      </MessageBar>
      <Announced
        message={`${sampleQueries.length} search results available.`}
      />
      {sampleQueries.length === 0 ? NoResultsFound('No samples found') :
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
      }
    </div>
  );
}

// @ts-ignore
const SampleQueries = styled(unstyledSampleQueries, sidebarStyles);
export default SampleQueries;
