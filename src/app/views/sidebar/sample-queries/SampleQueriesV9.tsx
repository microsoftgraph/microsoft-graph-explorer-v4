/**
 * SampleQueriesV9 component renders a search box and a list of sample queries.
 * It fetches sample queries from the store and allows the user to search through them.
 *
 * @returns {JSX.Element} The rendered SampleQueriesV9 component.
 */
import {
  AriaLiveAnnouncer,
  Badge,
  Button,
  FlatTree,
  FlatTreeItem,
  InputOnChangeData,
  Link,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  SearchBox,
  SearchBoxChangeEvent,
  Text,
  Tooltip,
  TreeItemLayout,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent,
  typographyStyles
} from '@fluentui/react-components';
import { DismissRegular, DocumentText20Regular } from '@fluentui/react-icons';
import { IGroup } from '@fluentui/react/lib/DetailsList';
import React, { useEffect, useRef, useState } from 'react';

import { MessageBarType } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IQuery, ISampleQuery } from '../../../../types/query-runner';
import { GRAPH_URL } from '../../../services/graph-constants';
import { setQueryResponseStatus } from '../../../services/slices/query-status.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { fetchSamples } from '../../../services/slices/samples.slice';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import { substituteTokens } from '../../../utils/token-helpers';
import { translateMessage } from '../../../utils/translate-messages';
import {
  isJsonString, performSearch, trackDocumentLinkClickedEvent, trackSampleQueryClickEvent
} from './sample-query-utils';

const useStyles = makeStyles({
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },

  treeHeader: typographyStyles.body1Strong
});

export const SampleQueriesV9 = () => {
  const sampleQueriesStyles = useStyles();
  const samples = useAppSelector((s) => s.samples);
  // TODO: use a shimmer when pending is true
  const { error, pending, queries } = samples;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries);
  const shouldGenerateGroups = useRef(true);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState<boolean>(false);

  useEffect(() => {
    setSampleQueries(queries);
  }, [queries]);

  useEffect(() => {
    if (shouldGenerateGroups.current) {
      setGroups(generateGroupsFromList(sampleQueries, 'category'));
      if (groups && groups.length > 0) {
        shouldGenerateGroups.current = false;
      }
    }
  }, [sampleQueries, searchStarted]);

  const handleSearchValueChange = (
    _: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => {
    const value = data.value;
    shouldGenerateGroups.current = true;
    setSearchStarted((searchStatus) => !searchStatus);
    const filteredQueries = value ? performSearch(queries, value) : [];
    setSampleQueries(filteredQueries);
  };

  return (
    <>
      <SearchBox
        className={sampleQueriesStyles.searchBox}
        placeholder={translateMessage('Search sample queries')}
        onChange={handleSearchValueChange}
      />
      <hr />
      {error && <CachedSetMessageBar />}
      <SeeMoreQueriesMessageBar />
      <AriaLiveAnnouncer>
        <Text>{`${queries.length} search results available.`}</Text>
      </AriaLiveAnnouncer>
      <Samples queries={sampleQueries} groups={groups} />
    </>
  );
};

/**
 * CachedSetMessageBar component displays a warning message bar indicating
 * that the user is viewing a cached set. It includes a dismiss button.
 *
 * @returns {JSX.Element} The rendered MessageBar component.
 */
const CachedSetMessageBar = () => {
  return (
    <MessageBar intent={'warning'}>
      <MessageBarBody>
        {translateMessage('viewing a cached set')}
      </MessageBarBody>
      <MessageBarActions
        containerAction={
          <Button appearance='transparent' icon={<DismissRegular />} />
        }
      />
    </MessageBar>
  );
};

/**
 * SeeMoreQueriesMessageBar component renders a MessageBar with a link to the
 * Microsoft Graph API Reference documentation.
 * The link opens in a new tab and tracks the click event for telemetry purposes.
 *
 * @returns {JSX.Element} The rendered MessageBar component with a link.
 */
const SeeMoreQueriesMessageBar = () => {
  return (
    <MessageBar intent={'info'}>
      <MessageBarBody>
        {translateMessage('see more queries')}{' '}
        <Link
          target='_blank'
          rel='noopener noreferrer'
          onClick={(e) =>
            telemetry.trackLinkClickEvent(
              (e.currentTarget as HTMLAnchorElement).href,
              componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK
            )
          }
          href='https://learn.microsoft.com/graph/api/overview?view=graph-rest-1.0'
          inline={true}
        >
          {translateMessage('Microsoft Graph API Reference docs')}
        </Link>
      </MessageBarBody>
    </MessageBar>
  );
};

interface SampleLeaf {
  leafs: ISampleQuery[];
  group: IGroup;
  handleSelectedSample: (item: ISampleQuery)=> void;
}

/**
 * Renders a list of sample leaf items.
 *
 * @param {SampleLeaf} props - The properties for the component.
 * @param {ISampleQuery[]} props.leafs - The list of sample queries to render.
 * @param {Group} props.group - The group to which the sample queries belong.
 *
 * @returns {JSX.Element} A React fragment containing the rendered sample leaf items.
 */
const RenderSampleLeafs = (props: SampleLeaf) => {
  const { leafs, group, handleSelectedSample } = props;


  return (
    <>
      {leafs.map((query: ISampleQuery) => {
        return (
          <FlatTreeItem
            key={query.id}
            parentValue={group.name}
            value={query.humanName}
            aria-level={2}
            aria-setsize={leafs.length}
            aria-posinset={leafs.findIndex((q) => q.id === query.id) + 1}
            itemType='leaf'
          >
            <TreeItemLayout
            onClick={()=>handleSelectedSample(query)}
              iconBefore={<MethodIcon method={query.method} />}
              aside={<ResourceLink item={query}/>}
            >
              <Tooltip
                withArrow
                content={query.humanName}
                relationship='label'
                positioning='above-start'
              >
                <Text>{query.humanName}</Text>
              </Tooltip>
            </TreeItemLayout>
          </FlatTreeItem>
        );
      })}
    </>
  );
};

/**
 * Component that renders a link to a resource document.
 *
 * @param {Object} props - The component props.
 * @param {ISampleQuery} props.item - The sample query item containing the document link.
 * @returns {JSX.Element} The rendered link component.
 */
const ResourceLink = ({item}: {item: ISampleQuery}) =>{
  const href = item.docLink ?? '';
  return (
    <Link aria-label={href} target='_blank' href={href} onClick={()=>trackDocumentLinkClickedEvent(item)}>
      <DocumentText20Regular />
    </Link>
  )
}

/**
 * A functional component that returns a JSX element representing an HTTP method badge.
 *
 * @param {Object} props - The props object.
 * @param {string} props.method - The HTTP method (e.g., 'GET', 'POST', 'PATCH', 'DELETE', 'PUT').
 *
 * @returns {JSX.Element} A JSX element representing the HTTP method badge.
 */
const MethodIcon = ({ method }: { method: string }) => {
  const methods: Record<string, JSX.Element> = {
    'GET': <Badge appearance="filled" color="brand">GET</Badge>,
    'POST': <Badge appearance="filled" color="success">POST</Badge>,
    'PATCH': <Badge appearance="filled" color="severe">PATCH</Badge>,
    'DELETE': <Badge appearance="filled" color="danger">DELETE</Badge>,
    'PUT': <Badge appearance="filled" color="warning">PUT</Badge>
  }
  return methods[method]
}

/**
 * Props for the Samples component.
 *
 * @interface SamplesProps
 * @property {ISampleQuery[]} queries - An array of sample queries.
 * @property {IGroup[]} groups - An array of groups.
 */
interface SamplesProps {
  queries: ISampleQuery[];
  groups: IGroup[];
}

/**
 * The `Samples` component is responsible for displaying a list of sample queries
 * organized into groups. It uses a flat tree structure to render the groups and their
 * respective queries. The component fetches sample queries if none are provided
 * through props.
 *
 * @param {SamplesProps} props - The properties passed to the component.
 * @param {ISampleQuery[]} props.queries - The list of sample queries to display.
 * @param {Group[]} props.groups - The groups to organize the sample queries.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Samples = (props: SamplesProps) => {
  const dispatch = useAppDispatch();
  const { queries, groups } = props;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries);
  const sampleQueriesStyles = useStyles();
  const profile = useAppSelector(state=>state.profile)

  useEffect(() => {
    if (queries.length === 0) {
      dispatch(fetchSamples());
    } else {
      setSampleQueries(queries);
    }
  }, [queries]);

  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(
    () => new Set()
  );
  const handleOpenChange = (
    _event: TreeOpenChangeEvent,
    data: TreeOpenChangeData
  ) => {
    setOpenItems(data.openItems);
  };

  const sampleQueryItemSelected = (item: ISampleQuery)=>{
    const queryVersion = item.requestUrl.substring(1, 5);
    const sampleQuery: IQuery = {
      sampleUrl: GRAPH_URL + item.requestUrl,
      selectedVerb: item.method,
      sampleBody: item.postBody,
      sampleHeaders: item.headers || [],
      selectedVersion: queryVersion
    };
    substituteTokens(sampleQuery, profile!);
    sampleQuery.sampleBody = getSampleBody(sampleQuery);

    if (item.tip) {
      displayTipMessage(item);
    }

    trackSampleQueryClickEvent(item);
    dispatch(setSampleQuery(sampleQuery));
  }

  const getSampleBody = (query: IQuery): string => {
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

  return (
    <FlatTree
      openItems={openItems}
      onOpenChange={handleOpenChange}
      aria-label='Flat Tree'
    >
      {groups.map((group, pos) => (
        <React.Fragment key={pos}>
          <FlatTreeItem
            value={group.name}
            aria-level={1}
            aria-setsize={2}
            aria-posinset={pos}
            itemType='branch'
          >
            <TreeItemLayout
              className={sampleQueriesStyles.treeHeader}
              aside={
                <Badge appearance='tint' color='informative'>
                  {group.count}
                </Badge>
              }
            >
              {group.name}
            </TreeItemLayout>
          </FlatTreeItem>
          {openItems.has(group.name) && (
            <RenderSampleLeafs
              leafs={sampleQueries.slice(
                group.startIndex,
                group.startIndex + group.count
              )}
              group={group}
              handleSelectedSample={sampleQueryItemSelected}
            />
          )}
        </React.Fragment>
      ))}
    </FlatTree>
  );
};
