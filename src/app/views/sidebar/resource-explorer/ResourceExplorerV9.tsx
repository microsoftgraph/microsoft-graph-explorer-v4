import {
  Button,
  SearchBox,
  Spinner,
  Switch,
  Label,
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  CounterBadge,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent
} from '@fluentui/react-components';
import { StackShim, StackItemShim } from '@fluentui/react-migration-v8-v9';
import { Collections20Regular } from '@fluentui/react-icons';
import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { addResourcePaths, removeResourcePaths } from '../../../services/slices/collections.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { GRAPH_URL } from '../../../services/graph-constants';
import { searchResources } from '../../../utils/resources/resources-filter';
import { translateMessage } from '../../../utils/translate-messages';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { createResourcesList, getResourcePaths, getUrlFromLink } from './resource-explorer.utils';
import ResourceLink from './ResourceLinkV9';
import { usePopups } from '../../../services/hooks/usePopups';
import {
  useResourceExplorerStyles,
  useSearchBoxStyles,
  useSpinnerStyles
} from './resourceExplorerStyles';

const ResourceExplorer = (props: any) => {
  const { data, pending } = useAppSelector((state) => state.resources);
  const { collections } = useAppSelector((state) => state.collections);

  const resourceExplorerStyles = useResourceExplorerStyles();
  const searchBoxStyles = useSearchBoxStyles();
  const spinnerStyles = useSpinnerStyles();

  const dispatch: AppDispatch = useAppDispatch();
  const selectedLinks = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
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
  const [items, setItems] = useState<IResourceLink[]>(navigationGroup);
  const { show: previewCollection } = usePopups('preview-collection', 'panel');
  const [openItems, setOpenItems] = useState<Set<TreeItemValue>>(new Set());

  useEffect(() => {
    setItems(navigationGroup);
  }, [filteredPayload.length]);

  const addToCollection = (item: IResourceLink) => {
    dispatch(addResourcePaths(getResourcePaths(item, version)));
  }

  const removeFromCollection = (item: IResourceLink) => {
    dispatch(removeResourcePaths(getResourcePaths(item, version)));
  }

  const changeVersion = (_event: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean }): void => {
    const selectedVersion = data.checked ? versions[1].key : versions[0].key;
    setVersion(selectedVersion);
  }

  const changeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedSearchText = event.target.value.trim();
    setSearchText(trimmedSearchText);
  }

  const debouncedSearch = useMemo(() => {
    return debounce((event: React.ChangeEvent<HTMLInputElement>) => changeSearchValue(event), 300);
  }, []);

  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: IResourceLink) => {
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

  const setQuery = (resourceLink: IResourceLink) => {
    const link = resourceLink;
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

  const AsideContent = ({ messageCount }: { messageCount?: number }) => (
    <>
      {messageCount && messageCount > 0 ? (
        <CounterBadge count={messageCount} color="informative" size="small" />
      ) : null}
    </>
  );

  const handleOpenChange = (event: TreeOpenChangeEvent, data: TreeOpenChangeData) => {
    setOpenItems(data.openItems);
  };

  const renderTreeItems = (items: IResourceLink[], level = 1, parentValue?: string) => {
    return items.map((item, index) => (
      <React.Fragment key={item.key}>
        <FlatTreeItem
          value={item.key ?? ''}
          itemType={item.links.length > 0 ? 'branch' : 'leaf'}
          aria-level={level}
          aria-setsize={items.length}
          aria-posinset={index + 1}
          parentValue={parentValue}
          onClick={(ev) => clickLink(ev, item)}
        >
          <TreeItemLayout
            aside={item.links.length > 0 ? <AsideContent messageCount={item.links.length} /> : null}
          >
            <ResourceLink
              link={item}
              version={item.version!}
              resourceOptionSelected={(activity: string, context: IResourceLink) =>
                resourceOptionSelected(activity, context)}
            />
          </TreeItemLayout>
        </FlatTreeItem>
        {openItems.has(item.key) && renderTreeItems(item.links, level + 1, item.key)}
      </React.Fragment>
    ));
  };

  if (pending) {
    return (
      <Spinner
        className={spinnerStyles.root}
        size='large'
        label={`${translateMessage('loading resources')} ...`}
        labelPosition="before"
      />
    );
  }

  return (
    <section style={{ marginTop: '8px' }}>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={(event) => debouncedSearch(event as React.ChangeEvent<HTMLInputElement>)}
        className={searchBoxStyles.root}
      />
      <Button onClick={openPreviewCollection}
        icon={<Collections20Regular />}
        aria-label={translateMessage('My API Collection')}
        className={resourceExplorerStyles.apiCollectionButton}
      >
        {translateMessage('My API Collection')}
        <StackShim horizontal reversed verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <StackItemShim align='auto'>
            <div className={resourceExplorerStyles.apiCollectionCount}>
              {selectedLinks.length > 0 ? `(${selectedLinks.length})` : ''}
            </div>
          </StackItemShim>
        </StackShim>
      </Button>
      <StackShim horizontal tokens={{ childrenGap: 10, padding: 10 }} horizontalAlign='space-between'>
        <Label style={{ position: 'relative' }}>
          {translateMessage('Resources available')}
        </Label>
        <StackShim horizontal tokens={{ childrenGap: 10 }}>
          <Switch
            onChange={changeVersion}
            labelPosition='after'
            style={{ position: 'relative', top: '2px' }}
          />
          <Label style={{ position: 'relative', top: '2px' }} >
            {translateMessage('Switch to beta')}
          </Label>
        </StackShim>
      </StackShim>
      {
        items.length === 0 ? NoResultsFound('No resources found', { paddingBottom: '20px' }) :
          <FlatTree
            className={resourceExplorerStyles.tree}
            aria-label="Resource Explorer"
            openItems={openItems}
            onOpenChange={handleOpenChange}
          >
            {renderTreeItems(items)}
          </FlatTree>
      }
    </section>
  );
}

export default ResourceExplorer;