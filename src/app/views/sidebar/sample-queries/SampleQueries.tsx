import {
  Announced, DetailsList, DetailsRow, FontSizes, FontWeights, getId,
  getTheme, GroupHeader, IColumn, Icon, IDetailsGroupDividerProps,
  IDetailsRowProps, IDetailsRowStyles, IGroup, Link, mergeStyles, MessageBar, MessageBarType, SearchBox,
  SelectionMode, Spinner, SpinnerSize, TooltipHost
} from '@fluentui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { geLocale } from '../../../../appLocale';
import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IQuery, ISampleQuery } from '../../../../types/query-runner';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { setQueryResponseStatus } from '../../../services/actions/query-status-action-creator';
import { fetchSamples } from '../../../services/actions/samples-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { getStyleFor } from '../../../utils/http-methods.utils';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { substituteTokens } from '../../../utils/token-helpers';
import { translateMessage } from '../../../utils/translate-messages';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import {
  isJsonString, performSearch, shouldRunQuery, trackDocumentLinkClickedEvent,
  trackSampleQueryClickEvent
} from './sample-query-utils';

const SampleQueries = (): JSX.Element => {

  const [selectedQuery, setSelectedQuery] = useState<ISampleQuery | null>(null)
  const { authToken, profile, samples } =
    useAppSelector((state) => state);
  const tokenPresent = authToken.token;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(samples.queries);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const currentTheme = getTheme();

  const { error, pending } = samples;

  const theme = getTheme();
  const groupHeaderClass = mergeStyles(sidebarStyles(theme).groupHeader);
  const queryRowClass = mergeStyles(sidebarStyles(theme).queryRow);
  const badgeClass = mergeStyles(sidebarStyles(theme).badge);
  const docLinkClass = mergeStyles(sidebarStyles(theme).docLink);
  const queryContentClass = mergeStyles(sidebarStyles(theme).queryContent);
  const searchBoxClass = mergeStyles(sidebarStyles(theme).searchBox);
  const spinnerClass = mergeStyles(sidebarStyles(theme).spinner);
  const queryListClass = mergeStyles(sidebarStyles(theme).queryList);
  const rowDisabledClass = mergeStyles(sidebarStyles(theme).rowDisabled);

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

  const searchValueChanged = (event_: ChangeEvent<HTMLInputElement> | undefined, newValue?: string) => {
    shouldGenerateGroups.current = true;
    setSearchStarted(searchStatus => !searchStatus);
    const { queries } = samples;
    const filteredQueries = newValue ? performSearch(queries, newValue) : queries;
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
      status: query.tip
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
                className={docLinkClass}
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
              className={badgeClass}
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
            <span aria-label={queryContent} className={queryContentClass}>
              {queryContent}
            </span>
          </TooltipHost>
        );
      }
    }
  ];

  const renderRow = (row?: IDetailsRowProps): JSX.Element | null => {
    let selectionDisabled = false;
    const customStyles: Partial<IDetailsRowStyles> = {};

    if (row) {
      if (selectedQuery?.id === row.item.id) {
        customStyles.root = { backgroundColor: currentTheme.palette.neutralLight };
      }

      const query: ISampleQuery = row.item!;
      if (!shouldRunQuery({ method: query.method, authenticated: tokenPresent, url: query.requestUrl })) {
        selectionDisabled = true;
      }
      return (
        <div className={groupHeaderClass} onClick={() => {
          if (!selectionDisabled) {
            querySelected(query);
          }
          setSelectedQuery(row.item)
        }}>
          <DetailsRow
            {...row}
            styles={customStyles}
            className={
              queryRowClass +
              ' ' +
              (selectionDisabled ? rowDisabledClass : '')
            }
            data-selection-disabled={selectionDisabled}
            getRowAriaLabel={() => row.item.method.toLowerCase() + row.item.humanName}
          />
        </div>
      );
    }
    return null;
  };

  const onRenderGroupHeader = (properties?: IDetailsGroupDividerProps): JSX.Element | null => {
    return (
      <GroupHeader
        {...properties}
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
        className={spinnerClass}
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
        className={searchBoxClass}
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
          href={`https://learn.microsoft.com/${geLocale}/graph/api/overview?view=graph-rest-1.0`}
          underline
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
            className={queryListClass}
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
              onRenderHeader: onRenderGroupHeader
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

export default SampleQueries;