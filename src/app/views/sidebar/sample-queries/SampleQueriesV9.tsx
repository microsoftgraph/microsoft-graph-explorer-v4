import {
    Button, InputOnChangeData, makeStyles, MessageBar, MessageBarActions, MessageBarBody,
    SearchBox, SearchBoxChangeEvent, Link, AriaLiveAnnouncer, Text } from '@fluentui/react-components';
    import {
        DetailsList, DetailsListLayoutMode, IGroup, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { DismissRegular } from '@fluentui/react-icons';
import { useRef, useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../../../store';
import { ISampleQuery } from '../../../../types/query-runner';
import { translateMessage } from '../../../utils/translate-messages';
import { performSearch } from './sample-query-utils';
import { componentNames, telemetry } from '../../../../telemetry';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { fetchSamples } from '../../../services/slices/samples.slice';
import { generateGroupsFromList } from '../../../utils/generate-groups';


const useStyles = makeStyles({
    searchBox: {
        width: '100%',
        maxWidth: '100%'
    }
})

export const SampleQueriesV9 = ()=>{
    const sampleQueriesStyles = useStyles();
    const samples = useAppSelector(s => s.samples);
    // TODO: use a shimmer when pending is true
    const {error, pending, queries} = samples;
    const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries)
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


    const handleSearchValueChange = (_: SearchBoxChangeEvent, data: InputOnChangeData)=>{
        const value = data.value;
        shouldGenerateGroups.current = true;
        setSearchStarted(searchStatus => !searchStatus);
        const filteredQueries = value ? performSearch(queries, value) : [];
        setSampleQueries(filteredQueries);
    }
    return <>
        <SearchBox
            className={sampleQueriesStyles.searchBox}
            placeholder={translateMessage('Search sample queries')}
            onChange={handleSearchValueChange} />
        <hr />
        {error && <CachedSetMessageBar />}
        <SeeMoreQueriesMessageBar/>
        <AriaLiveAnnouncer><Text>{`${queries.length} search results available.`}</Text></AriaLiveAnnouncer>
        <Samples queries={sampleQueries} groups={groups} />
    </>
}

const CachedSetMessageBar = ()=>{
    return (
        <MessageBar intent={'warning'}>
            <MessageBarBody>{translateMessage('viewing a cached set')}</MessageBarBody>
            <MessageBarActions containerAction={<Button appearance="transparent" icon={<DismissRegular />} />} />
        </MessageBar>
    )
}

const SeeMoreQueriesMessageBar = ()=>{
    return (
        <MessageBar intent={'info'}>
            <MessageBarBody>{translateMessage('see more queries')}{' '}
            <Link
                target='_blank'
                rel="noopener noreferrer"
                onClick={(e) => telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
                    componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK)}
                href="https://learn.microsoft.com/graph/api/overview?view=graph-rest-1.0"
                inline={true}>{translateMessage('Microsoft Graph API Reference docs')}</Link>
            </MessageBarBody>
      </MessageBar>
    )
}

interface SamplesProps {
    queries: ISampleQuery[]
    groups: IGroup[]
}

const Samples = (props: SamplesProps) =>{
    const dispatch = useAppDispatch();
    const {queries, groups} = props
    const [sampleQueries, setSampleQueries] = useState<ISampleQuery[]>(queries);

    useEffect(() => {
        if (queries.length === 0) {
          dispatch(fetchSamples());
        } else {
          setSampleQueries(queries)
        }
    }, [queries])
    return (
    <div>
        {sampleQueries.length === 0 ? NoResultsFound('No samples found'):
        <DetailsList
        items={sampleQueries}
        groups={groups}
        compact={true}
        selectionMode={SelectionMode.none}
        setKey="none"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        />
    }
    </div>
    )
}
