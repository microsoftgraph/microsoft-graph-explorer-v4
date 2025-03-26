import {
  Announced, DetailsList, DetailsRow, FontSizes, FontWeights, getId,
  getTheme,
  GroupHeader, IColumn, Icon, IDetailsRowStyles, IGroup, Link, MessageBar, MessageBarType, SearchBox,
  SelectionMode, Spinner, SpinnerSize, styled, TooltipHost
} from '@fluentui/react';
import { useEffect, useRef, useState } from 'react';

import { geLocale } from '../../../../appLocale';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IQuery, ISampleQueriesProps, ISampleQuery } from '../../../../types/query-runner';
import { setQueryResponseStatus } from '../../../services/slices/query-status.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { GRAPH_URL } from '../../../services/graph-constants';
import { fetchSamples } from '../../../services/slices/samples.slice';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { substituteTokens } from '../../../utils/token-helpers';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import {
  isJsonString, performSearch, shouldRunQuery, trackDocumentLinkClickedEvent,
  trackSampleQueryClickEvent
} from './sample-query-utils';

const UnstyledSampleQueries = (sampleProps?: ISampleQueriesProps): JSX.Element => {

  const [selectedQuery, setSelectedQuery] = useState<ISampleQuery | null>(null)
  const authToken = useAppSelector((state) => state.auth.authToken);
  const profile = useAppSelector((state) => state.profile);
  const samples = useAppSelector((state) => state.samples);
  const tokenPresent = authToken.token;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(samples.queries);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentTheme = getTheme();

  const { error, pending, queries } = samples;

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
      if (groups && groups.length > 0) {
        shouldGenerateGroups.current = false;
      }
    }
  }, [sampleQueries, searchStarted]);

  const searchValueChanged = (_event: any, value?: string): void => {
    shouldGenerateGroups.current = true;
    setSearchStarted(searchStatus => !searchStatus);
    const filteredQueries = value ? performSearch(queries, value) : queries;
    setSampleQueries(filteredQueries);
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
      status: query.tip!
    }));
  }

  const columns: IColumn[] = [
    {
      key: 'button',
      name: '',
      fieldName: 'button',
      minWidth: 15,
      maxWidth: 25,
      isIconOnly: true,

      onRender: (item: ISampleQuery) => {
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
            <Link
              aria-label={item.docLink}
              target="_blank"
              href={item.docLink}
              onClick={() => trackDocumentLinkClickedEvent(item)}
            >
              <Icon
                className={classes.docLink}
                aria-label={translateMessage('Read documentation')}
                iconName='TextDocument'
                style={{
                  marginRight: '45%',
                  width: 10
                }}
              />
            </Link>
          </TooltipHost>
        );
      }
    },
    {
      key: 'authRequiredIcon',
      name: '',
      fieldName: 'authRequiredIcon',
      minWidth: 20,
      maxWidth: 20,
      isIconOnly: true,
      onRender: (item: ISampleQuery) => {
        const signInText = translateMessage('Sign In to try this sample');

        if (shouldRunQuery({ method: item.method, authenticated: tokenPresent, url: item.requestUrl })) {
          return <div aria-hidden='true' />;
        }

        return (
          <TooltipHost
            tooltipProps={{
              onRenderContent: () => (
                <div style={{ paddingBottom: 3 }}>
                  {translateMessage(signInText)}
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
      }
    },
    {
      key: 'method',
      name: '',
      fieldName: 'method',
      minWidth: 20,
      maxWidth: 50,
      onRender: (item: ISampleQuery) => {

        return (
          <TooltipHost
            tooltipProps={{
              onRenderContent: () => (
                <div style={{ paddingBottom: 3 }}>{item.method}</div>
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
      }
    },
    {
      key: 'humanName',
      name: '',
      fieldName: 'humanName',
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: ISampleQuery) => {
        const queryContent = item.humanName;
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
  ];

  const renderRow = (props: any): any => {
    let selectionDisabled = false;
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (selectedQuery?.id === props.item.id) {
      customStyles.root = { backgroundColor: currentTheme.palette.neutralLight };
    }

    if (props) {
      const query: ISampleQuery = props.item!;
      if (!shouldRunQuery({ method: query.method, authenticated: tokenPresent, url: query.requestUrl })) {
        selectionDisabled = true;
      }
      return (
        <div className={classes.groupHeader}>
          <DetailsRow
            {...props}
            styles={customStyles}
            onClick={() => {
              if (!selectionDisabled) {
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
            fontWeight: FontWeights.semibold,
            paddingBottom: 2
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
          {translateMessage('viewing a cached set')}
        </MessageBar>
      )}
      <MessageBar
        messageBarType={MessageBarType.info}
        isMultiline={true}
        dismissButtonAriaLabel='Close'
      >
        {translateMessage('see more queries')}
        <Link
          target='_blank'
          rel="noopener noreferrer"
          onClick={(e) => telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK)}
          // eslint-disable-next-line max-len
          href='https://learn.microsoft.com/en-us/graph/graph-explorer/graph-explorer-overview?view=graph-rest-1.0%2F/WT.mc_id=msgraph_inproduct_graphex'
          underline
        >
          {translateMessage('Microsoft Graph API Reference docs')}
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
const SampleQueries = styled(UnstyledSampleQueries, sidebarStyles);
export default SampleQueries;
