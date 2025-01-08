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
  Spinner,
  Text,
  tokens,
  Tooltip,
  TreeItemLayout,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent
} from '@fluentui/react-components';
import {
  DismissRegular,
  DocumentText20Regular,
  LockClosed16Regular
} from '@fluentui/react-icons';
import { IGroup } from '@fluentui/react/lib/DetailsList';
// TODO: update these checks for @fluentui/react@9.0.0+

import React, { Fragment, useEffect, useRef, useState } from 'react';

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
import { NoResultsFoundV9 } from '../sidebar-utils/SearchResultsV9';
import {
  isJsonString,
  performSearch,
  trackDocumentLinkClickedEvent,
  trackSampleQueryClickEvent
} from './sample-query-utils';

type Colors =
  | 'brand'
  | 'danger'
  | 'important'
  | 'informative'
  | 'severe'
  | 'subtle'
  | 'success'
  | 'warning';

const useStyles = makeStyles({
  container: {
    marginTop: '6px'
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  iconBefore: {
    width: '74px',
    maxWidth: '74px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '2px'
  },
  badge: {
    width: '58px',
    maxWidth: '58px'
  },
  disabled: {
    backgroundColor: tokens.colorSubtleBackgroundHover,
    '&:hover': {
      cursor: 'not-allowed'
    }
  },
  samplesTree: {
    overflowY: 'auto',
    maxHeight: '900px'
  }
});

export const SampleQueriesV9 = () => {
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
    if (value && filteredQueries.length >= 0) {
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
      />
      <hr />
      {error && <CachedSetMessageBar />}
      <SeeMoreQueriesMessageBar />
      <AriaLiveAnnouncer>
        <Text>{`${sampleQueries.length} search results available.`}</Text>
      </AriaLiveAnnouncer>
      {pending ? (
        <LoadingSamples />
      ) : (
        <Samples
          queries={sampleQueries}
          groups={groups}
          searchValue={searchValue}
        />
      )}
    </div>
  );
};

const LoadingSamples = () => {
  return (
    <Spinner
      size='large'
      label={`${translateMessage('loading samples')} ...`}
      labelPosition='below'
    />
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
  isSignedIn: boolean;
  leafs: ISampleQuery[];
  group: IGroup;
  handleSelectedSample: (item: ISampleQuery) => void;
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
        const notSignedIn = !isSignedIn && query.method !== 'GET';
        const handleOnClick = (item: ISampleQuery) => {
          if (!isSignedIn) {
            if (query.method === 'GET') {
              handleSelectedSample(item);
            }
          } else {
            handleSelectedSample(item);
          }
        };

        return (
          <FlatTreeItem
            key={query.id}
            parentValue={group.name}
            value={query.humanName}
            aria-level={2}
            aria-setsize={leafs.length}
            aria-posinset={leafs.findIndex((q) => q.id === query.id) + 1}
            itemType='leaf'
            className={notSignedIn ? leafStyles.disabled : ''}
            id={query.id}
          >
            <TreeItemLayout
              onClick={() => handleOnClick(query)}
              iconBefore={
                <MethodIcon isSignedIn={isSignedIn} method={query.method} />
              }
              aside={<ResourceLink item={query} />}
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
const ResourceLink = ({ item }: { item: ISampleQuery }) => {
  const href = item.docLink ?? '';
  return (
    <Link
      aria-label={item.humanName + translateMessage('Read documentation')}
      target='_blank'
      href={href}
      onClick={() => trackDocumentLinkClickedEvent(item)}
    >
      <DocumentText20Regular />
    </Link>
  );
};

/**
 * A functional component that returns a JSX element representing an HTTP method badge.
 *
 * @param {Object} props - The props object.
 * @param {string} props.method - The HTTP method (e.g., 'GET', 'POST', 'PATCH', 'DELETE', 'PUT').
 *
 * @returns {JSX.Element} A JSX element representing the HTTP method badge.
 */
const MethodIcon = ({
  method,
  isSignedIn
}: {
  method: string;
  isSignedIn: boolean;
}) => {
  const sampleQueriesStyles = useStyles();
  const colors: Record<string, Colors> = {
    GET: 'brand',
    POST: 'success',
    PATCH: 'severe',
    DELETE: 'danger',
    PUT: 'warning'
  };

  return (
    <div className={sampleQueriesStyles.iconBefore}>
      <Badge
        className={sampleQueriesStyles.badge}
        appearance='filled'
        size='small'
        color={colors[method]}
        aria-label={'http method ' + method + ' for'}
      >
        {method}
      </Badge>
      {method !== 'GET' && !isSignedIn && (
        <Tooltip
          withArrow
          content={translateMessage('Sign In to try this sample')}
          relationship='label'
          positioning='above-start'
        >
          <LockClosed16Regular />
        </Tooltip>
      )}
    </div>
  );
};

const getSampleBody = (query: IQuery): string => {
  return query.sampleBody ? parseSampleBody(query.sampleBody) : '';
};

const parseSampleBody = (sampleBody: string) => {
  return isJsonString(sampleBody) ? JSON.parse(sampleBody) : sampleBody;
};

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
  searchValue: string;
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
  const sampleStyles = useStyles();
  const dispatch = useAppDispatch();
  const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries);
  const profile = useAppSelector((state) => state.profile);
  const authToken = useAppSelector((state) => state.auth.authToken);
  const authenticated = authToken.token;

  useEffect(() => {
    if (!searchValue && queries.length === 0) {
      dispatch(fetchSamples());
    } else {
      setSampleQueries(queries);
    }
  }, [queries]);

  const openSampleItems = new Set<string>();
  'Getting Started'.split('').forEach((ch) => openSampleItems.add(ch));
  openSampleItems.add('Getting Started');

  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(
    () => openSampleItems
  );
  const handleOpenChange = (
    _event: TreeOpenChangeEvent,
    data: TreeOpenChangeData
  ) => {
    setOpenItems(data.openItems);
  };

  const sampleQueryItemSelected = (item: ISampleQuery) => {
    const queryVersion = item.requestUrl.substring(1, 4);
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
  };

  const displayTipMessage = (query: ISampleQuery) => {
    dispatch(
      setQueryResponseStatus({
        messageBarType: 'warning',
        statusText: 'Tip',
        status: query.tip!
      })
    );
  };

  return (
    <Fragment>
      {sampleQueries.length === 0 && (
        <NoResultsFoundV9 message='No sample queries' />
      )}
      <FlatTree
        openItems={openItems}
        onOpenChange={handleOpenChange}
        aria-label={translateMessage('Sample Queries')}
        className={sampleStyles.samplesTree}
      >
        {groups.map((group, pos) => (
          <React.Fragment key={group.key}>
            <FlatTreeItem
              value={group.name}
              aria-level={1}
              aria-setsize={2}
              aria-posinset={pos + 1}
              itemType='branch'
              aria-label={
                group.name +
                translateMessage('sample queries group has ') +
                group.count +
                translateMessage('Resources')
              }
            >
              <TreeItemLayout
                aside={
                  <Badge
                    appearance='tint'
                    color='informative'
                    aria-label={group.count + translateMessage('Resources')}
                  >
                    {group.count}
                  </Badge>
                }
              >
                <Text weight='semibold'>{group.name}</Text>
              </TreeItemLayout>
            </FlatTreeItem>
            {openItems.has(group.name) && (
              <RenderSampleLeafs
                isSignedIn={authenticated}
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
    </Fragment>
  );
};
