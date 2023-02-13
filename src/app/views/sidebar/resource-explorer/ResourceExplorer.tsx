import {
  Breadcrumb, DefaultButton,
  IBreadcrumbItem, INavLink, INavLinkGroup, Label, Nav,
  SearchBox, Spinner, SpinnerSize,
  Stack, styled, Toggle
} from '@fluentui/react';
import debouce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../telemetry';
import { IQuery } from '../../../../types/query-runner';
import { IResource, IResourceLink, ResourceLinkType, ResourceOptions } from '../../../../types/resources';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { addResourcePaths } from '../../../services/actions/resource-explorer-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { getResourcesSupportedByVersion } from '../../../utils/resources/resources-filter';
import { searchBoxStyles } from '../../../utils/searchbox.styles';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { NoResultsFound } from '../sidebar-utils/SearchResult';
import { sidebarStyles } from '../Sidebar.styles';
import CommandOptions from './command-options/CommandOptions';
import {
  createResourcesList, getCurrentTree,
  getResourcePaths,
  getUrlFromLink, removeCounter
} from './resource-explorer.utils';
import ResourceLink from './ResourceLink';
import { navStyles } from './resources.styles';

const UnstyledResourceExplorer = (props: any) => {
  const dispatch: AppDispatch = useDispatch();
  const { resources } = useAppSelector(
    (state) => state
  );

  const classes = classNames(props);
  const { data, pending, paths: selectedLinks } = resources;
  const versions: any[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const resourcesToUse = JSON.parse(JSON.stringify(data.children));

  const [version, setVersion] = useState(versions[0].key);
  const [searchText, setSearchText] = useState<string>('');
  const filteredPayload = getResourcesSupportedByVersion(resourcesToUse, version, searchText);
  const navigationGroup = createResourcesList(filteredPayload, version, searchText);

  const [resourceItems, setResourceItems] = useState<IResource[]>(filteredPayload);
  const [items, setItems] = useState<INavLinkGroup[]>(navigationGroup);

  useEffect(() => {
    setItems(navigationGroup);
    setResourceItems(filteredPayload)
  }, [filteredPayload.length]);

  const [isolated, setIsolated] = useState<any>(null);
  const [linkLevel, setLinkLevel] = useState(-1);

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
        isExpanded: true,
        links: navLink.links
      }
    ];
    setItems(tree);
    setIsolated(navLink);
    setLinkLevel(navLink.level);
    telemetry.trackEvent(eventTypes.LISTITEM_CLICK_EVENT,
      {
        ComponentName: componentNames.RESOURCES_ISOLATE_QUERY_LIST_ITEM,
        ResourcePath: getUrlFromLink(navLink)
      });
  }

  const disableIsolation = (): void => {
    setIsolated(null);
    setSearchText('');
    const filtered = getResourcesSupportedByVersion(data.children, version);
    setLinkLevel(-1);
    setItems(createResourcesList(filtered, version));
  }

  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
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
    <section style={{ marginTop: '8px' }}>
      {!isolated && <>
        <SearchBox
          placeholder={translateMessage('Search resources')}
          onChange={debouncedSearch}
          disabled={!!isolated}
          styles={searchBoxStyles}
        />
        <hr />
        <Stack wrap tokens={{ childrenGap: 10, padding: 10 }}>
          <Toggle label={`${translateMessage('Switch to beta')}`}
            onChange={changeVersion}
            onText={translateMessage('On')}
            offText={translateMessage('Off')}
            inlineLabel
            styles={{ text: { position: 'relative', top: '4px' } }}
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

      <Label styles={{ root: { position: 'relative', left: '10px' } }}>
        <FormattedMessage id='Resources available' />
      </Label>
      {
        items[0].links.length === 0 ? NoResultsFound('No resources found', { paddingBottom: '60px' }) :
          (<Nav
            groups={items}
            styles={navStyles}
            onRenderLink={(link: any) => {
              return <ResourceLink
                link={link}
                isolateTree={isolateTree}
                resourceOptionSelected={(activity: string, context: unknown) =>
                  resourceOptionSelected(activity, context)}
                linkLevel={linkLevel}
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
