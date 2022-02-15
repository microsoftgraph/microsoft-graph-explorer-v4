import {
  Breadcrumb, ChoiceGroup, DefaultButton,
  IBreadcrumbItem, IChoiceGroupOption, INavLink, INavLinkGroup, Label, Nav, SearchBox, Spinner, SpinnerSize,
  Stack, styled
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { telemetry, eventTypes, componentNames } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';

import { IResource, IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { addResourcePaths } from '../../../services/actions/resource-explorer-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';
import CommandOptions from './CommandOptions';
import {
  createResourcesList, getCurrentTree,
  getResourcePaths,
  getResourcesSupportedByVersion, getUrlFromLink, removeCounter
} from './resource-explorer.utils';
import ResourceLink from './ResourceLink';
import { navStyles } from './resources.styles';

const unstyledResourceExplorer = (props: any) => {
  const dispatch = useDispatch();
  const { resources } = useSelector(
    (state: IRootState) => state
  );
  const classes = classNames(props);
  const { data, pending, paths: selectedLinks } = resources;

  const versions: any[] = [
    { key: 'v1.0', text: 'v1.0', iconProps: { iconName: 'CloudWeather' } },
    { key: 'beta', text: 'beta', iconProps: { iconName: 'PartlyCloudyNight' } }
  ];
  const [version, setVersion] = useState(versions[0].key);
  const filteredPayload = getResourcesSupportedByVersion(data, version);
  const navigationGroup = createResourcesList(filteredPayload.children, version);

  const [resourceItems, setResourceItems] = useState<IResource[]>(filteredPayload.children);
  const [items, setItems] = useState<INavLinkGroup[]>(navigationGroup);

  useEffect(() => {
    setItems(navigationGroup);
    setResourceItems(filteredPayload.children)
  }, [filteredPayload.children.length]);

  const [isolated, setIsolated] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>('');

  const performSearch = (needle: string, haystack: IResource[]) => {
    const keyword = needle.toLowerCase();
    return haystack.filter((sample: IResource) => {
      const name = sample.segment.toLowerCase();
      return name.toLowerCase().includes(keyword);
    });
  }

  const generateBreadCrumbs = () => {
    if (!!isolated && isolated.paths.length > 0) {
      const breadcrumbItems: IBreadcrumbItem[] = [];
      isolated.paths.forEach((path: string) => {
        path = removeCounter(path);
        breadcrumbItems.push({ text: path, key: path, onClick: navigateToBreadCrumb });
      });
      let { name } = isolated;
      name = removeCounter(name);
      breadcrumbItems.push({ text: name, key: name });
      return breadcrumbItems;
    }
    return [];
  }

  const addToCollection = (item: IResourceLink) => {
    dispatch(addResourcePaths(getResourcePaths(item, version)));
  }

  const changeVersion = (ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option: IChoiceGroupOption | undefined): void => {
    const selectedVersion = option!.key;
    setVersion(selectedVersion);
    const list = getResourcesSupportedByVersion(data, selectedVersion);
    const dataSet = (searchText) ? performSearch(searchText, list.children) : list.children;
    setResourceItems(dataSet);
    setItems(createResourcesList(dataSet, selectedVersion));
  }

  const changeSearchValue = (event: any, value?: string) => {
    let filtered: any[] = [...data.children];
    setSearchText(value || '');
    if (value) {
      filtered = performSearch(value, filtered);
    }
    const dataSet = getResourcesSupportedByVersion({
      children: filtered,
      labels: data.labels,
      segment: data.segment
    }, version).children;
    setResourceItems(dataSet);
    setItems(createResourcesList(dataSet, version));
  }

  const navigateToBreadCrumb = (ev?: any, item?: IBreadcrumbItem): void => {
    const iterator = item!.key;
    if (iterator === '/') {
      disableIsolation();
      return;
    }

    if (isolated) {
      const { paths } = isolated;
      const level = paths.findIndex((k: string) => k === iterator);
      const currentTree = getCurrentTree({ paths, level, resourceItems, version });
      isolateTree(currentTree);
    }
  }

  const isolateTree = (navLink: any): void => {
    const tree = [
      {
        isExpanded: false,
        links: navLink.links
      }
    ];
    setItems(tree);
    setIsolated(navLink);
    telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT,
      {
        ComponentName: componentNames.RESOURCES_ISOLATE_QUERY_LIST_ITEM,
        ResourcePath: getUrlFromLink(navLink)
      });
  }

  const disableIsolation = (): void => {
    setIsolated(null);
    setSearchText('');
    const filtered = getResourcesSupportedByVersion(data, version);
    setItems(createResourcesList(filtered.children, version));
  }

  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item? : INavLink) => {
    ev!.preventDefault();
    item!.isExpanded = !item!.isExpanded;
    setQuery(item!);
  }

  const resourceOptionSelected = (activity: string, context: any) => {
    if (activity === ResourceOptions.ADD_TO_COLLECTION) {
      addToCollection(context);
    }
  }

  const setQuery = (resourceLink: INavLink) => {
    if (resourceLink.type === ResourceLinkType.NODE) { return; }
    const resourceUrl = getUrlFromLink(resourceLink);
    if (!resourceUrl) { return; }
    const sampleUrl = `${GRAPH_URL}/${version}${resourceUrl}`;
    const query: IQuery = {
      selectedVerb: resourceLink.method!,
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


  const breadCrumbs = generateBreadCrumbs();

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
    <section>
      {!isolated && <>
        <SearchBox
          placeholder={translateMessage('Search resources')}
          onChange={changeSearchValue}
          disabled={!!isolated}
          styles={searchBoxStyles}
        />
        <hr />
        <Stack wrap tokens={{ childrenGap: 10, padding: 10 }}>
          <ChoiceGroup
            label={translateMessage('Select version')}
            defaultSelectedKey={version}
            options={versions}
            onChange={changeVersion}
          />
        </Stack>
      </>}

      {selectedLinks && selectedLinks.length > 0 && <>
        <Label><FormattedMessage id='Selected Resources' /> ({selectedLinks.length})</Label>
        <CommandOptions version={version} />
      </>
      }

      {
        isolated && breadCrumbs.length > 0 &&
        <>
          <DefaultButton
            text={translateMessage('Close isolation')}
            iconProps={{ iconName: 'Back' }}
            onClick={disableIsolation}
          />
          <hr />
          <Breadcrumb
            items={breadCrumbs}
            maxDisplayedItems={3}
            ariaLabel={translateMessage('Path display')}
            overflowAriaLabel={translateMessage('More path links')}
          />
        </>
      }

      <Label>
        <FormattedMessage id='Resources available' />
      </Label>
      <Nav
        groups={items}
        styles={navStyles}
        onRenderLink={(link) => {
          return <ResourceLink
            link={link}
            isolateTree={isolateTree}
            resourceOptionSelected={(activity: string, context: unknown) => resourceOptionSelected(activity, context)}
            classes={classes}
          />
        }}
        onLinkClick={clickLink}
        className={classes.queryList} />
    </section >
  );
}

// @ts-ignore
const ResourceExplorer = styled(unstyledResourceExplorer, sidebarStyles);
export default ResourceExplorer;
