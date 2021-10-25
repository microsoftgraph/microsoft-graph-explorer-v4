import {
  Breadcrumb, Checkbox, ChoiceGroup, ContextualMenuItemType, DefaultButton,
  IBreadcrumbItem, IChoiceGroupOption, Icon, INavLink,
  Label, Nav, SearchBox, Spinner, SpinnerSize, styled
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { IResource } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';
import CommandOptions from './CommandOptions';
import LinkItem from './LinkItem';
import { createList, getCurrentTree, getResourcesSupportedByVersion, removeCounter } from './resource-explorer.utils';

const ResourceExplorer = (props: any) => {
  const { resources } = useSelector(
    (state: IRootState) => state
  );
  const classes = classNames(props);
  const { data, pending } = resources;
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
  const [selectedLinks, setSelectedLinks] = useState<INavLink[]>([]);

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

  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev!.preventDefault();
    if (item && item.name) {
      const itemsToSelect: INavLink[] = [...selectedLinks];
      itemsToSelect.push(item);
      setSelectedLinks(itemsToSelect);
    }
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
        alert(`you are clicking '${item.text}' on '${link.name}'`);
        break;
    }
  };

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

    const existsInSelectedItems = properties.key!.includes('drive');

    return <LinkItem
      style={{
        flexGrow: 1,
        textAlign: 'left',
        boxSizing: 'border-box'
      }}
      className={(existsInSelectedItems) ? 'is-selected' : ''}
      key={properties.key}
      items={menuItems}
      onItemClick={(e: any, item: any) => selectContextItem(e, item, properties)}>
      <span style={{ display: 'flex' }}>
        {!!properties.iconProperties && <Icon style={{ margin: '0 4px' }} {...properties.iconProperties} />}
        {properties.name}
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
        <ChoiceGroup
          label={translateMessage('Select version')}
          defaultSelectedKey={version}
          options={versions}
          onChange={changeVersion}
        />
      </>}

      {selectedLinks.length > 0 && <>
        <Label><FormattedMessage id="Selected Resources" /> ({selectedLinks.length})</Label>
        <CommandOptions list={selectedLinks} />
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
