/**
 * SampleQueriesV9 component renders a search box and a list of sample queries.
 * It fetches sample queries from the store and allows the user to search through them.
 *
 * @returns {JSX.Element} The rendered SampleQueriesV9 component.
 */
import {
  Button,
  InputOnChangeData,
  makeStyles,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  SearchBox,
  SearchBoxChangeEvent,
  Link,
  AriaLiveAnnouncer,
  Text,
  FlatTree,
  FlatTreeItem,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent,
  TreeItemLayout,
  typographyStyles,
  Badge
} from '@fluentui/react-components';
import { IGroup } from '@fluentui/react/lib/DetailsList';
import { DismissRegular } from '@fluentui/react-icons';
import { useRef, useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../../../store';
import { ISampleQuery } from '../../../../types/query-runner';
import { translateMessage } from '../../../utils/translate-messages';
import { performSearch } from './sample-query-utils';
import { componentNames, telemetry } from '../../../../telemetry';
import { fetchSamples } from '../../../services/slices/samples.slice';
import { generateGroupsFromList } from '../../../utils/generate-groups';
import React from 'react';

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
  const { leafs, group } = props;

  return (
    <>
      {leafs.map((query: ISampleQuery, id: number) => (
        <FlatTreeItem
          key={id}
          parentValue={group.name}
          value={query.humanName}
          aria-level={2}
          aria-setsize={leafs.length}
          aria-posinset={id + 1}
          itemType='leaf'
        >
          <TreeItemLayout>{query.humanName}</TreeItemLayout>
        </FlatTreeItem>
      ))}
    </>
  );
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
            />
          )}
        </React.Fragment>
      ))}
    </FlatTree>
  );
};
