/**
 * SampleQueries component renders a search box and a list of sample queries.
 * It fetches sample queries from the store and allows the user to search through them.
 *
 * @returns {JSX.Element} The rendered SampleQueries component.
 */
import {
  AriaLiveAnnouncer,
  Badge,
  Button,
  FlatTree,
  FlatTreeItem,
  InputOnChangeData,
  Link,
  mergeClasses,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  SearchBox,
  SearchBoxChangeEvent,
  Spinner,
  Text,
  Tooltip,
  TreeItemLayout,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent
} from '@fluentui/react-components';
import { DismissRegular, DocumentText20Regular, LockClosed16Regular } from '@fluentui/react-icons';

import React, { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, telemetry } from '../../../../telemetry';
import { IQuery, ISampleQuery } from '../../../../types/query-runner';
import { GRAPH_URL } from '../../../services/graph-constants';
import { setQueryResponseStatus } from '../../../services/slices/query-status.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { fetchSamples } from '../../../services/slices/samples.slice';
import { generateGroupsFromList, IGroup } from '../../../utils/generate-groups';
import { substituteTokens } from '../../../utils/token-helpers';
import { translateMessage } from '../../../utils/translate-messages';
import { METHOD_COLORS, NoResultsFound } from '../sidebar-utils/SidebarUtils';
import {
  isJsonString, performSearch, trackDocumentLinkClickedEvent, trackSampleQueryClickEvent
} from './sample-query-utils';
import { useStyles } from './SampleQueries.styles';

export const SampleQueries = () => {
  const sampleQueriesStyles = useStyles();
  const samples = useAppSelector((s) => s.samples);
  const { error, pending, queries } = samples;
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries);
  const shouldGenerateGroups = useRef(true);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [searchStarted, setSearchStarted] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

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
    setSearchValue(value);
    shouldGenerateGroups.current = true;
    setSearchStarted(true);
    const filteredQueries = value ? performSearch(queries, value) : [];
    if(value && filteredQueries.length > 0) {
      setSampleQueries(filteredQueries);
    } else {
      setSampleQueries(queries);
    }
  };


  return (
    <div className={sampleQueriesStyles.container}>
      <SearchBox
        className={sampleQueriesStyles.searchBox}
        placeholder={translateMessage('Search sample queries')}
        onChange={handleSearchValueChange}
        aria-live='polite'
        aria-label={translateMessage('Search sample queries')}
      />
      <hr />
      {error && <CachedSetMessageBar />}
      <SeeMoreQueriesMessageBar />
      <AriaLiveAnnouncer>
        <Text
          aria-live='polite'
          aria-label={`${sampleQueries.length} ${translateMessage('search results available')}.`}
        >
          {`${sampleQueries.length} ${translateMessage('search results available')}.`}
        </Text>
      </AriaLiveAnnouncer>
      {pending ? <LoadingSamples/> : <Samples queries={sampleQueries} groups={groups} searchValue={searchValue} />}
    </div>
  );
};

const LoadingSamples = ()=> {
  return (
    <Spinner
      size="large"
      label={`${translateMessage('loading samples')} ...`}
      labelPosition='below'
    />
  )
}

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
  const sampleQueriesStyles = useStyles();
  return (
    <MessageBar className={sampleQueriesStyles.messageBar} intent={'info'}>
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
  isSignedIn: boolean;
  leafs: ISampleQuery[];
  group: IGroup;
  handleSelectedSample: (item: ISampleQuery)=> void;
  selectedQueryKey: string | null;
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
  const { leafs, group, handleSelectedSample, isSignedIn } = props;
  const leafStyles = useStyles();

  return (
    <>
      {leafs.map((query: ISampleQuery) => {
        const queryKey = query.id ?? `${query.method}-${query.requestUrl}`;
        const isActive = queryKey === props.selectedQueryKey;
        const notSignedIn = !isSignedIn && query.method !== 'GET';
        const handleOnClick = (item:ISampleQuery)=>{
          if (!isSignedIn) {
            if (query.method === 'GET') {
              handleSelectedSample(item)
            }
          } else {
            handleSelectedSample(item)
          }
        }

        return (
          <FlatTreeItem
            key={query.id}
            parentValue={group.name}
            value={query.humanName}
            aria-level={2}
            aria-setsize={leafs.length}
            aria-posinset={leafs.findIndex((q) => q.id === query.id) + 1}
            itemType='leaf'
            className={mergeClasses(notSignedIn && leafStyles.disabled,isActive && leafStyles.activeLeaf)}
            id={query.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOnClick(query);
              }
            }}
            aria-description='has actions'
          >
            <TreeItemLayout
              className={leafStyles.itemLayout}
              onClick={()=>handleOnClick(query)}
              iconBefore={<MethodIcon isSignedIn={isSignedIn} method={query.method} />}
              aside={<>
                {query.method !== 'GET' && !isSignedIn && <Tooltip
                  withArrow
                  content={translateMessage('Sign In to try this sample')}
                  relationship='label'
                  positioning='above-start'
                >
                  <LockClosed16Regular/>
                </Tooltip>}
                <ResourceLink item={query}/>
              </>}
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
  const styles = useStyles();
  return (
    <Tooltip
      withArrow
      content={translateMessage('Read documentation')
      }
      relationship='label'
    >
      <Link
        className={styles.focusableLink}
        aria-label={translateMessage('Read documentation')}
        target='_blank' href={href} onClick={()=>trackDocumentLinkClickedEvent(item)}>
        <DocumentText20Regular />
      </Link>
    </Tooltip>
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
const MethodIcon = ({ method, isSignedIn }: { method: string, isSignedIn: boolean }) => {
  const sampleQueriesStyles = useStyles();

  return (
    <div className={sampleQueriesStyles.iconBefore}>
      <Badge
        className={sampleQueriesStyles.badge}
        size='medium'
        color={METHOD_COLORS[method]}
        aria-label={'http method ' + method + ' for'}>
        {method}
      </Badge>
    </div>
  )
}

const getSampleBody = (query: IQuery): string => {
  return query.sampleBody ? parseSampleBody(query.sampleBody) : '';
}

const parseSampleBody = (sampleBody: string) => {
  return isJsonString(sampleBody)
    ? JSON.parse(sampleBody)
    : sampleBody;
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
  searchValue: string
}

/**
 * The `Samples` component is responsible for displaying a list of sample queries
 * organized into groups. It uses a flat tree structure to render the groups and their
 * respective queries. The component fetches sample queries if none are provided
 * through props.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Samples: React.FC<SamplesProps> = ({ queries, groups, searchValue }) => {
  const dispatch = useAppDispatch();
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries);
  const profile = useAppSelector(state=>state.profile)
  const authToken= useAppSelector((state) => state.auth.authToken);
  const authenticated = authToken.token
  const styles = useStyles();
  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(new Set());
  const [selectedQueryKey, setSelectedQueryKey] = useState<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    if (!searchValue && queries.length === 0) {
      dispatch(fetchSamples());
    } else {
      setSampleQueries(queries);
      if (!hasAutoSelected && queries.length > 0) {
        const defaultSample = queries.find(q =>
          q.method === 'GET' && q.humanName.toLowerCase().includes('my profile')
        );

        if (defaultSample) {
          const defaultKey = defaultSample.id ?? `${defaultSample.method}-${defaultSample.requestUrl}`;
          setSelectedQueryKey(defaultKey);
          sampleQueryItemSelected(defaultSample);
          setHasAutoSelected(true);
        }
      }
    }
  }, [queries]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      setOpenItems(prev => {
        const newOpenItems = new Set(prev);
        newOpenItems.add(`group-${groups[0].name}`);
        return newOpenItems;
      });
    }
  }, [groups]);

  const handleOpenChange = (
    _event: TreeOpenChangeEvent,
    data: TreeOpenChangeData
  ) => {
    setOpenItems(data.openItems);
  };

  const sampleQueryItemSelected = (item: ISampleQuery)=>{
    const itemKey = item.id ?? `${item.method}-${item.requestUrl}`;
    setSelectedQueryKey(itemKey);
    dispatch(setQueryResponseStatus({
      messageBarType: '',
      statusText: '',
      status: ''
    }));
    const queryVersion = item.requestUrl.substring(1, 5);
    const sampleQuery: IQuery = {
      sampleUrl: GRAPH_URL + item.requestUrl,
      selectedVerb: item.method,
      sampleBody: item.postBody,
      sampleHeaders: item.headers || [],
      selectedVersion: queryVersion
    };
    if (profile) {
      substituteTokens(sampleQuery, profile);
    }
    sampleQuery.sampleBody = getSampleBody(sampleQuery);

    if (item.tip) {
      displayTipMessage(item);
    }

    trackSampleQueryClickEvent(item);
    dispatch(setSampleQuery(sampleQuery));
  }


  const displayTipMessage = (query: ISampleQuery) => {
    dispatch(setQueryResponseStatus({
      messageBarType: 'warning',
      statusText: 'Tip',
      status: query.tip!
    }));
  }

  const toggleGroup = (groupKey: string) => {
    setOpenItems((prevOpenItems) => {
      const newOpenItems = new Set(prevOpenItems);
      if (newOpenItems.has(groupKey)) {
        newOpenItems.delete(groupKey);
      } else {
        newOpenItems.add(groupKey);
      }
      return newOpenItems;
    });
  };

  return (
    <>
      {sampleQueries.length=== 0 && <NoResultsFound message='No sample queries'/>}
      <FlatTree
        openItems={openItems}
        onOpenChange={handleOpenChange}
        aria-label={translateMessage('Sample Queries')}
        className={styles.tree}>
        {groups.map((group, pos) => (
          <React.Fragment key={group.key}>
            <FlatTreeItem
              value={`group-${group.name}`}
              aria-level={1}
              aria-setsize={groups.length}
              aria-posinset={pos + 1}
              itemType='branch'
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleGroup(`group-${group.name}`);
                }
              }}
              aria-label={
                group.name + translateMessage('sample queries group has ') +
                group.count + translateMessage('Resources')}
            >
              <TreeItemLayout
                aside={
                  <Badge appearance='tint' color='informative' aria-label={group.count + translateMessage('Resources')}>
                    {group.count}
                  </Badge>
                }
              >
                <Text weight='semibold'>{group.name}</Text>
              </TreeItemLayout>
            </FlatTreeItem>
            {openItems.has(`group-${group.name}`) && (
              <RenderSampleLeafs
                isSignedIn={authenticated}
                leafs={sampleQueries.slice(
                  group.startIndex,
                  group.startIndex + group.count
                )}
                group={group}
                handleSelectedSample={sampleQueryItemSelected}
                selectedQueryKey={selectedQueryKey}
              />
            )}
          </React.Fragment>
        ))}
      </FlatTree>
    </>
  );
};
