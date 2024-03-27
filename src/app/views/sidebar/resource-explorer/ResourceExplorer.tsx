import {
  INavLink, INavLinkGroup, Label, Nav, SearchBox, Spinner, SpinnerSize,
  Stack,
  styled,
  Toggle
} from '@fluentui/react';
import debouce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/actions/collections-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { searchResources } from '../../../utils/resources/resources-filter';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import { UploadPostmanCollection } from './collection/UploadCollection';
import CommandOptions from './command-options/CommandOptions';
import {
  createResourcesList, getResourcePaths,
  getUrlFromLink
} from './resource-explorer.utils';
import ResourceLink from './ResourceLink';
import { navStyles } from './resources.styles';

const UnstyledResourceExplorer = (props: any) => {
  const { resources: { data, pending }, collections } = useAppSelector(
    (state) => state
  );

  const dispatch: AppDispatch = useDispatch();
  const classes = classNames(props);
  const selectedLinks = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const versions: any[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const [version, setVersion] = useState<string>(versions[0].key);
  const resourcesToUse = Object.keys(data[version]).length > 0 ? data[version].children! : [];
  const [searchText, setSearchText] = useState<string>('');
  const filteredPayload = searchText ? searchResources(resourcesToUse, searchText) : resourcesToUse;
  const navigationGroup = createResourcesList(filteredPayload, version, searchText);

  const [items, setItems] = useState<INavLinkGroup[]>(navigationGroup);

  useEffect(() => {
    setItems(navigationGroup);
  }, [filteredPayload.length]);

  const addToCollection = (item: IResourceLink) => {
    dispatch(addResourcePaths(getResourcePaths(item, version)));
  }

  const removeFromCollection = (item: IResourceLink) => {
    dispatch(removeResourcePaths(getResourcePaths(item, version)));
  }

  const changeVersion = (_event: React.MouseEvent<HTMLElement>, checked?: boolean | undefined): void => {
    const selectedVersion = checked ? versions[1].key : versions[0].key;
    setVersion(selectedVersion);
  }

  const changeSearchValue = (event: any, value?: string) => {
    const trimmedSearchText = value ? value.trim() : '';
    setSearchText(trimmedSearchText);
  }

  const debouncedSearch = useMemo(() => {
    return debouce(changeSearchValue, 300);
  }, []);


  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev!.preventDefault();
    item!.isExpanded = !item!.isExpanded;
    setQuery(item!);
  }

  const resourceOptionSelected = (activity: string, context: any) => {
    if (activity === ResourceOptions.ADD_TO_COLLECTION) {
      addToCollection(context);
    }

    if (activity === ResourceOptions.REMOVE_FROM_COLLECTION) {
      removeFromCollection(context);
    }
  }

  const setQuery = (resourceLink: INavLink) => {
    const link = resourceLink as IResourceLink;
    if (resourceLink.type === ResourceLinkType.NODE) { return; }
    const resourceUrl = getUrlFromLink(link.paths);
    if (!resourceUrl) { return; }
    const sampleUrl = `${GRAPH_URL}/${version}${resourceUrl}`;
    const verb = resourceLink.method!;
    const query: IQuery = {
      selectedVerb: verb.toString().toUpperCase(),
      selectedVersion: version,
      sampleUrl,
      sampleHeaders: [],
      sampleBody: undefined
    };
    dispatch(setSampleQuery(query));
    telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT, {
      ComponentName: componentNames.RESOURCES_LIST_ITEM,
      ResourceLink: resourceUrl,
      SelectedVersion: version
    });
  }

  if (pending) {
    return (
      <Spinner
        className={classes.spinner}
        size={SpinnerSize.large}
        label={`${translateMessage('loading resources')} ...`}
        ariaLive='assertive'
        labelPosition='top'
      />
    );
  }

  return (
    <section style={{ marginTop: '8px' }}>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={debouncedSearch}
        styles={searchBoxStyles}
      />
      <hr />
      <Stack horizontal tokens={{ childrenGap: 13, padding: 10 }}>
        <Toggle label={`${translateMessage('Switch to beta')}`}
          onChange={changeVersion}
          onText={translateMessage('On')}
          offText={translateMessage('Off')}
          inlineLabel
          styles={{ text: { position: 'relative', top: '4px' } }}
        />
        < UploadPostmanCollection />
      </Stack>

      <Stack wrap tokens={{ childrenGap: 10, padding: 10 }}>
        {selectedLinks && selectedLinks.length > 0 && <>
          <Label>{translateMessage('Selected Resources')} ({selectedLinks.length})</Label>
          <CommandOptions version={version} />
        </>
        }
      </Stack>

      {items[0].links.length > 0 && <Label styles={{ root: { position: 'relative', left: '10px' } }}>
        {translateMessage('Resources available')}
      </Label>
      }

      {
        items[0].links.length === 0 ? NoResultsFound('No resources found', { paddingBottom: '20px' }) :
          (<Nav
            groups={items}
            styles={navStyles}
            onRenderLink={link => {
              return <ResourceLink
                link={link!}
                version={version}
                resourceOptionSelected={(activity: string, context: unknown) =>
                  resourceOptionSelected(activity, context)}
                classes={classes}
              />
            }}
            onLinkClick={clickLink}
            className={classes.queryList} />
          )
      }
    </section >
  );
}

// @ts-ignore
const ResourceExplorer = styled(UnstyledResourceExplorer, sidebarStyles);
export default ResourceExplorer;