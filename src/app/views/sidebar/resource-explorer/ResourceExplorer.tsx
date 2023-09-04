import {
  getTheme,
  INavLink, INavLinkGroup, Label, mergeStyles, Nav, SearchBox, Spinner, SpinnerSize,
  Stack,
  Toggle
} from '@fluentui/react';
import debounce from 'lodash.debounce';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResource, IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/actions/collections-action-creators';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getResourcesSupportedByVersion } from '../../../utils/resources/resources-filter';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
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

const ResourceExplorer = () => {
  const { resources: { data, pending }, collections } = useAppSelector(
    (state) => state
  );

  const dispatch: AppDispatch = useDispatch();
  const theme = getTheme();
  const spinnerClass = mergeStyles(sidebarStyles(theme).spinner);
  const queryListClass = mergeStyles(sidebarStyles(theme).queryList);

  const selectedLinks = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const versions: { key: string, text: string }[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const resourcesToUse = data.children ? JSON.parse(JSON.stringify(data.children)) : [] as IResource[];

  const [version, setVersion] = useState(versions[0].key);
  const [searchText, setSearchText] = useState<string>('');
  const filteredPayload = getResourcesSupportedByVersion(resourcesToUse, version, searchText);
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

  const changeVersion = (_event: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    const selectedVersion = checked ? versions[1].key : versions[0].key;
    setVersion(selectedVersion);
  }

  const debouncedSearch = useRef(
    debounce(async (newValue?: string) => {
      setSearchText(newValue ? newValue.trim() : '');
    }, 300)
  ).current;

  const searchValueChanged = (newValue?: string): void => {
    debouncedSearch(newValue);
  }

  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev!.preventDefault();
    item!.isExpanded = !item!.isExpanded;
    setQuery(item!);
  }

  const resourceOptionSelected = (activity: ResourceOptions, context: IResourceLink) => {
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
        className={spinnerClass}
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
        onChange={(e_, value) => searchValueChanged(value)}
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
          <Label><FormattedMessage id='Selected Resources' /> ({selectedLinks.length})</Label>
          <CommandOptions version={version} />
        </>
        }
      </Stack>

      {items[0].links.length > 0 && <Label styles={{ root: { position: 'relative', left: '10px' } }}>
        <FormattedMessage id='Resources available' />
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
                resourceOptionSelected={resourceOptionSelected}
              />
            }}
            onLinkClick={clickLink}
            className={queryListClass} />
          )
      }
    </section >
  );
}

// @ts-ignore
export default ResourceExplorer;