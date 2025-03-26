import {
  AriaLiveAnnouncer,
  Button,
  SearchBox,
  Spinner,
  Switch,
  Label,
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  CounterBadge,
  Text,
  Tooltip,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent,
  useRestoreFocusTarget
} from '@fluentui/react-components';
import { Collections20Regular, AddSquare20Regular, SubtractSquare20Regular } from '@fluentui/react-icons';
import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { existsInCollection } from './resourcelink.utils';
import { addResourcePaths, removeResourcePaths } from '../../../services/slices/collections.slice';
import { setSampleQuery } from '../../../services/slices/sample-query.slice';
import { GRAPH_URL } from '../../../services/graph-constants';
import { searchResources } from '../../../utils/resources/resources-filter';
import { translateMessage } from '../../../utils/translate-messages';
import { NoResultsFound } from '../sidebar-utils/SidebarUtils';
import { createResourcesList, getResourcePaths, getUrlFromLink } from './resource-explorer.utils';
import ResourceLink from './ResourceLink';
import { usePopups } from '../../../services/hooks/usePopups';
import {
  useResourceExplorerStyles,
  useSearchBoxStyles,
  useSpinnerStyles
} from './resourceExplorerStyles';

const ResourceExplorer = () => {
  const { data, pending } = useAppSelector((state) => state.resources);
  const { collections } = useAppSelector((state) => state.collections);

  const resourceExplorerStyles = useResourceExplorerStyles();
  const searchBoxStyles = useSearchBoxStyles();
  const spinnerStyles = useSpinnerStyles();
  const restoreFocusTargetAttribute = useRestoreFocusTarget();

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

  const changeVersion = (_event: React.ChangeEvent<HTMLInputElement>, data_: { checked: boolean }): void => {
    const selectedVersion = data_.checked ? versions[1].key : versions[0].key;
    setVersion(selectedVersion);
  }

  const changeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedSearchText = event.target.value.trim();
    setSearchText(trimmedSearchText);
  }

  const debouncedSearch = useMemo(() => {
    return debounce((event: React.ChangeEvent<HTMLInputElement>) => changeSearchValue(event), 300);
  }, []);

  const clickLink = (ev?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>, item?: IResourceLink) => {
    ev?.preventDefault();
    if (!item) { return; }
    // Toggle expanded state for items with child links
    if (item.links.length > 0) {
      const updatedOpenItems = new Set(openItems);
      if (updatedOpenItems.has(item.key)) {
        updatedOpenItems.delete(item.key);
      } else {
        updatedOpenItems.add(item.key);
      }
      setOpenItems(updatedOpenItems);
    }
    setQuery(item);
  };

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

  const ActionsContent = ({
    item,
    messageCount
  }: {
    item: IResourceLink;
    messageCount?: number;
  }) => {
    const paths = collections?.find(k => k.isDefault)?.paths || [];

    const isInCollection = useMemo(() => {
      return existsInCollection(item, paths, version);
    }, [item, paths, version]);

    const handleAddToCollection = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      addToCollection(item);
    };

    const handleRemoveFromCollection = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      removeFromCollection(item);
    };

    return (
      <div className={resourceExplorerStyles.treeActions}>
        <div>
          {isInCollection ? (
            <Tooltip
              withArrow
              content={translateMessage('Remove from collection')}
              relationship='label'
            >
              <Button
                aria-label={translateMessage('Remove from collection')}
                appearance='transparent'
                icon={<SubtractSquare20Regular />}
                onClick={handleRemoveFromCollection}
              />
            </Tooltip>
          ) : (
            <Tooltip
              withArrow
              content={translateMessage('Add to collection')}
              relationship='label'
            >
              <Button
                aria-label={translateMessage('Add to collection')}
                appearance='transparent'
                aria-describedby='tooltip'
                icon={<AddSquare20Regular />}
                onClick={handleAddToCollection}
              />
            </Tooltip>
          )}
        </div>
        {messageCount && messageCount > 0 && (
          <CounterBadge
            count={messageCount}
            color="informative"
            aria-label={messageCount + translateMessage('Resources')}
          />
        )}
      </div>
    );
  };

  const handleOpenChange = (_event: TreeOpenChangeEvent, data_: TreeOpenChangeData) => {
    setOpenItems(data_.openItems);
  };

  const renderTreeItems = (items_: IResourceLink[], level = 1, parentValue?: string) => {
    return items_.map((item, index) => (
      <React.Fragment key={item.key}>
        <FlatTreeItem
          key={item.key}
          value={item.key ?? ''}
          itemType={item.links.length > 0 ? 'branch' : 'leaf'}
          aria-level={level}
          aria-setsize={items_.length}
          aria-posinset={index + 1}
          parentValue={parentValue}
          tabIndex={0}
          className={resourceExplorerStyles.focusVisible}
          onClick={(ev) => clickLink(ev, item)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              clickLink(ev, item);
            }
            // Let Tab key pass through to child elements
            if (ev.key !== 'Tab') {
              ev.stopPropagation();
            }
          }}
        >
          <TreeItemLayout
            className={resourceExplorerStyles.treeItemLayout}
            actions={
              item.links.length > 0 ? (
                <ActionsContent
                  item={item}
                  messageCount={item.links?.length}
                />
              ) : null
            }
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
    <div className={resourceExplorerStyles.container}>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={(event) => debouncedSearch(event as React.ChangeEvent<HTMLInputElement>)}
        className={searchBoxStyles.root}
        aria-live='polite'
        aria-label={translateMessage('Search resources')}
      />
      <AriaLiveAnnouncer>
        <Text
          aria-live='polite'
          aria-label={`${items.length} ${translateMessage('search results available')}.`}
        >
          {`${items.length} ${translateMessage('search results available')}.`}
        </Text>
      </AriaLiveAnnouncer>
      <Button onClick={openPreviewCollection}
        icon={<Collections20Regular />}
        {...restoreFocusTargetAttribute}
        aria-label={translateMessage(`My API Collection: ${selectedLinks?.length} ${translateMessage('items')}`)}
        className={resourceExplorerStyles.apiCollectionButton}
      >
        {translateMessage('My API Collection')}{selectedLinks.length > 0 ? `(${selectedLinks.length})` : ''}
      </Button>
      <div className={resourceExplorerStyles.stackStyles}>
        <Label weight='semibold'>
          {translateMessage('Resources available')}
        </Label>
        <div className={resourceExplorerStyles.versioning}>
          <Switch
            aria-label={translateMessage('Switch to beta')}
            onChange={changeVersion}
            labelPosition='after'
          />
          <Label weight='semibold'>
            {translateMessage('Switch to beta')}
          </Label>
        </div>
      </div>
      {
        items.length === 0 ? <NoResultsFound message='No resources found' /> :
          <FlatTree
            className={resourceExplorerStyles.tree}
            aria-label={translateMessage('Resources')}
            openItems={openItems}
            onOpenChange={handleOpenChange}
          >
            {renderTreeItems(items)}
          </FlatTree>
      }
    </div>
  );
}

export default ResourceExplorer;