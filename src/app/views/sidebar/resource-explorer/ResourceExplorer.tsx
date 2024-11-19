import {
  DefaultButton,
  INavLink, INavLinkGroup, Label,
  MessageBar,
  MessageBarType,
  Nav, SearchBox, Spinner, SpinnerSize, Stack, styled, Toggle,
  useTheme} from '@fluentui/react';
import debouce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/slices/collections.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { GRAPH_URL } from '../../../services/graph-constants';
import { searchResources } from '../../../utils/resources/resources-filter';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import { createResourcesList, getResourcePaths, getUrlFromLink } from './resource-explorer.utils';
import ResourceLink from './ResourceLink';
import { navStyles, resourceExplorerStyles } from './resources.styles';
import { usePopups } from '../../../services/hooks/usePopups';

const UnstyledResourceExplorer = (props: any) => {
  const { resources: { data, pending }, collections: {collections} } = useAppSelector(
    (state) => state
  );

  const dispatch: AppDispatch = useAppDispatch();
  const classes = classNames(props);
  const theme = useTheme();
  const styles = resourceExplorerStyles(theme);
  const selectedLinks = collections  && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const versions: { key: string, text: string }[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const [version, setVersion] = useState<string>(versions[0].key);
  const resourcesToUse = data?.[version]?.children
    && Object.keys(data[version]).length > 0
    ? data[version].children
    : [];
  const [searchText, setSearchText] = useState<string>('');
  const filteredPayload = searchText ? searchResources(resourcesToUse, searchText) : resourcesToUse;
  const navigationGroup = createResourcesList(filteredPayload, version, searchText);
  const [items, setItems] = useState<INavLinkGroup[]>(navigationGroup);
  const { show: previewCollection } = usePopups('preview-collection', 'panel');

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

  const resourceOptionSelected = (activity: string, context: IResourceLink) => {
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

  const openPreviewCollection = () => {
    previewCollection({
      settings: {
        title: translateMessage('My API collection'),
        width: 'xl'
      }
    })
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
      <Stack horizontal tokens={{ childrenGap: 10, padding: 10 }} horizontalAlign='space-between'>
        <Label styles={{ root: { position: 'relative'} }}>
          {translateMessage('Resources available')}
        </Label>
        <Stack horizontal tokens={{ childrenGap: 10}}>
          <Toggle
            onChange={changeVersion}
            inlineLabel
            styles={{ root: { position: 'relative', top: '2px' } }}
          />
          <Label styles={{ root: { position: 'relative', top: '2px' } }} >
            {translateMessage('Switch to beta')}
          </Label>
        </Stack>
      </Stack>
      <DefaultButton onClick={openPreviewCollection}
        iconProps={{iconName: 'AddBookmark'}}
        ariaLabel={translateMessage('My API Collection')}
        styles={styles.apiCollectionButton}
        text={translateMessage('My API Collection')}
      >
        <Stack horizontal reversed verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Stack.Item align='auto'>
            <div style={styles.apiCollectionCount}>
              {selectedLinks.length > 0 ? `(${selectedLinks.length})` : '0'}
            </div>
          </Stack.Item>
        </Stack>
      </DefaultButton>

      {
        items[0].links.length === 0 ? NoResultsFound('No resources found', { paddingBottom: '20px' }) :
          (<Nav
            groups={items}
            styles={navStyles}
            onRenderLink={link => {
              return <ResourceLink
                link={link!}
                version={version}
                resourceOptionSelected={(activity: string, context: IResourceLink) =>
                  resourceOptionSelected(activity, context)}
                classes={classes}
              />
            }}
            onLinkClick={clickLink}
            className={classes.queryList} />
          )
      }
    </section>
  );
}

// @ts-ignore
const ResourceExplorer = styled(UnstyledResourceExplorer, sidebarStyles);
export default ResourceExplorer;