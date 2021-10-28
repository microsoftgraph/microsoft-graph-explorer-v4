import {
  Breadcrumb, ChoiceGroup, ContextualMenuItemType, DefaultButton,
  IBreadcrumbItem, IChoiceGroupOption, Icon, INavLink,
  Label, Nav, SearchBox, Spinner, SpinnerSize, styled
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IQuery } from '../../../../types/query-runner';
import { IResource } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';
import LinkItem from './LinkItem';
import MethodIndicator from './MethodIndicator';
import AvailableMethods from './methods/AvailableMethods';
import {
  createList, getAvailableMethods, getCurrentTree,
  getResourcesSupportedByVersion, removeCounter
} from './resource-explorer.utils';

const ResourceExplorer = (props: any) => {
  const { resources } = useSelector(
    (state: IRootState) => state
  );
  const classes = classNames(props);
  const { data, pending } = resources;

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
  const dispatch = useDispatch();
  const versions: IChoiceGroupOption[] = [
    { key: 'v1.0', text: 'v1.0', iconProps: { iconName: 'CloudWeather' } },
    { key: 'beta', text: 'beta', iconProps: { iconName: 'PartlyCloudyNight' } }
  ];

  const [version, setVersion] = useState(versions[0].key);
  const [searchText, setSearchText] = useState<string>('');

  const filteredPayload = getResourcesSupportedByVersion(data, version);
  const [resourceItems, setResourceItems] = useState<IResource[]>(filteredPayload.children);
  const [items, setItems] = useState(createList(resourceItems, version));
  const [isolated, setIsolated] = useState<any>(null);

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

  const changeVersion = (ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option: IChoiceGroupOption | undefined): void => {
    const selectedVersion = option!.key;
    setVersion(selectedVersion);
    const list = getResourcesSupportedByVersion(data, selectedVersion);
    const dataSet = (searchText) ? performSearch(searchText, list.children) : list.children;
    setResourceItems(dataSet);
    setItems(createList(dataSet, selectedVersion));
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
    setItems(createList(dataSet, version));
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

  const navStyles: any = (properties: any) => ({
    chevronIcon: [
      properties.isExpanded && {
        transform: 'rotate(0deg)'
      },
      !properties.isExpanded && {
        transform: 'rotate(-90deg)'
      }
    ]
  });

  const isolateTree = (navLink: any): void => {
    const tree = [
      {
        isExpanded: false,
        links: navLink.links
      }
    ];
    setItems(tree);
    setIsolated(navLink);
  }

  const disableIsolation = (): void => {
    setIsolated(null);
    setSearchText('');
    const filtered = getResourcesSupportedByVersion(data, version);
    setItems(createList(filtered.children, version));
  }

  const selectContextItem = (e: any, item: any, link: INavLink) => {
    switch (item.key) {
      case 'isolate':
        isolateTree(link);
        break;
      default:
        setQuery(link);
        break;
    }
  };

  const setQuery = (link: INavLink) => {
    const sampleUrl = `${GRAPH_URL}/${version}${getUrlFromLink()}`;

    function getUrlFromLink() {
      const { paths } = link;
      let url = '/';
      if (paths.length > 1) {
        paths.slice(1).forEach((path: string) => {
          url += path + '/';
        });
      }
      url += removeCounter(link.name);
      return url;
    }

    const query: IQuery = {
      selectedVerb: 'GET',
      selectedVersion: version,
      sampleUrl,
      sampleHeaders: [],
      sampleBody: undefined
    };
    dispatch(setSampleQuery(query));
  }

  const filterContent = (selection: string[]) => {
    const filtered = getResourcesSupportedByVersion(data, version, selection);
    setItems(createList(filtered.children, version));
  }

  const renderCustomLink = (properties: any) => {
    const menuItems = [
      {
        key: 'actions',
        itemType: ContextualMenuItemType.Header,
        text: properties.name
      }
    ];

    if (properties!.links!.length > 0) {
      menuItems.push(
        {
          key: 'isolate',
          text: translateMessage('Isolate'),
          itemType: ContextualMenuItemType.Normal
        });
    }

    if (properties.type === 'path') {
      menuItems.push({
        key: 'run-query',
        text: translateMessage('Run Query'),
        itemType: ContextualMenuItemType.Normal
      })
    }

    const availableMethods = getAvailableMethods(properties.labels, version);

    return <LinkItem
      style={{
        flexGrow: 1,
        textAlign: 'left',
        boxSizing: 'border-box'
      }}
      key={properties.key}
      items={menuItems}
      onItemClick={(e: any, item: any) => selectContextItem(e, item, properties)}>
      <span style={{ display: 'flex' }}>
        {!!properties.iconProperties && <Icon style={{ margin: '0 4px' }} {...properties.iconProperties} />}
        {properties.name}
        {availableMethods.length > 0 && <MethodIndicator methods={availableMethods} key={properties.key} />}
      </span>
    </LinkItem>;
  }

  const breadCrumbs = (!!isolated) ? generateBreadCrumbs() : [];
  return (
    <section>
      {!isolated && <>
        <SearchBox
          placeholder={translateMessage('Search resources')}
          onChange={changeSearchValue}
          disabled={!!isolated}
          styles={{ field: { paddingLeft: 10 } }}
        />
        <hr />
        <div className='row'>
          <div className='col-xs-12 col-lg-7 col-md-7'>
            <ChoiceGroup
              label={translateMessage('Select version')}
              defaultSelectedKey={version}
              options={versions}
              onChange={changeVersion}
            />
          </div>
          <div className='col-xs-12 col-lg-5 col-md-5'>
            <Label><FormattedMessage id='Methods available' /></Label>
            <AvailableMethods changeAvailableMethods={filterContent} />
          </div>
        </div>
        <br />
      </>}

      {isolated && breadCrumbs.length > 0 &&
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
        </>}

      <Label>
        <FormattedMessage id='Resources available' />
      </Label>
      <Nav
        groups={items}
        styles={navStyles}
        onRenderLink={renderCustomLink}
        className={classes.queryList} />
    </section>
  );
}

// @ts-ignore
const styledResourceExplorer = styled(ResourceExplorer, sidebarStyles);
export default styledResourceExplorer;
