import {
    Button, InputOnChangeData, makeStyles, MessageBar, MessageBarActions, MessageBarBody,
    SearchBox, SearchBoxChangeEvent, Link } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { useRef, useState } from 'react';

import { useAppSelector } from '../../../../store';
import { ISampleQuery } from '../../../../types/query-runner';
import { translateMessage } from '../../../utils/translate-messages';
import { performSearch } from './sample-query-utils';
import { componentNames, telemetry } from '../../../../telemetry';
import { geLocale } from '../../../../appLocale';

const useStyles = makeStyles({
    searchBox: {
        width: '100%',
        maxWidth: '100%'
    }
})

export const SampleQueriesV9 = ()=>{
    const sampleQueriesStyles = useStyles();
    const samples = useAppSelector(s => s.samples);
    const {error, pending, queries} = samples

    const shouldGenerateGroups = useRef(true);
    const [sampleQueries, setSampleQueries] = useState<ISampleQuery[] | string>(samples.queries);

    const handleSearchValueChange = (_: SearchBoxChangeEvent, data: InputOnChangeData)=>{
        const value = data.value;
        shouldGenerateGroups.current = true;
        const filteredQueries = value ? performSearch(queries, value) : value;
        setSampleQueries(filteredQueries);
    }

    return <>
        <SearchBox
            className={sampleQueriesStyles.searchBox}
            placeholder={translateMessage('Search sample queries')}
            onChange={handleSearchValueChange} />
        <hr />
        {error && <CachedSetMessageBar />}
        <MoreQueriesMessageBar/>
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

const MoreQueriesMessageBar = ()=>{
    return (
        <MessageBar intent="info">
            <MessageBarBody>{translateMessage('see more queries')}{' '}
            <Link
                target='_blank'
                rel="noopener noreferrer"
                onClick={(e) => telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
                    componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK)}
                href={`https://learn.microsoft.com/${geLocale}/graph/api/overview?view=graph-rest-1.0`}
                inline={true}>{translateMessage('Microsoft Graph API Reference docs')}</Link>
            </MessageBarBody>
      </MessageBar>
    )
}
