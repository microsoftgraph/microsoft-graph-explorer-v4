import {
  Breadcrumb, ChoiceGroup, DefaultButton,
  IBreadcrumbItem, IChoiceGroupOption, Label, Nav, Panel, PanelType, SearchBox, Spinner, SpinnerSize, styled
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IResource } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { fetchAutoCompleteOptions } from '../../../services/actions/autocomplete-action-creators';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';
import { AvailableMethods } from './methods';
import QueryParameters from './QueryParameters';
import {
  createList, getCurrentTree,
  getResourcesSupportedByVersion, getUrlFromLink, removeCounter
} from './resource-explorer.utils';
import ResourceLink from './ResourceLink';

const ResourceExplorer = (props: any) => {
  const { autoComplete, resources } = useSelector(
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

  const versions: IChoiceGroupOption[] = [
    { key: 'v1.0', text: 'v1.0', iconProps: { iconName: 'CloudWeather' } },
    { key: 'beta', text: 'beta', iconProps: { iconName: 'PartlyCloudyNight' } }
  ];
  const dispatch = useDispatch();
  const [version, setVersion] = useState(versions[0].key);
  const [searchText, setSearchText] = useState<string>('');

  const filteredPayload = getResourcesSupportedByVersion(data, version);
  const [resourceItems, setResourceItems] = useState<IResource[]>(filteredPayload.children);
  const [items, setItems] = useState(createList(resourceItems, version));
  const [isolated, setIsolated] = useState<any>(null);
  const [panelIsOpen, setPanelIsOpen] = useState<boolean>(false);
  const [panelContext, setPanelContext] = useState<any>(null);
  const [panelHeaderText, setPanelHeaderText] = useState('');

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

  const dismissPanel = () => {
    let open = panelIsOpen;
    open = !open;
    setPanelIsOpen(open);
    setPanelContext(null);
  }

  const openPanel = (activity: string, context: any) => {
    switch (activity) {
      default:
        const requestUrl = getUrlFromLink(context);
        setPanelIsOpen(true);
        setPanelContext(activity);
        setPanelHeaderText(`${requestUrl}`);
        dispatch(fetchAutoCompleteOptions(requestUrl, version))
        break;
    }
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
            <AvailableMethods />
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
        onRenderLink={(link) => {
          return <ResourceLink
            link={link}
            isolateTree={isolateTree}
            version={version}
            openPanel={(activity: string, context: any) => openPanel(activity, context)}
          />
        }}
        className={classes.queryList} />

      <Panel
        isOpen={panelIsOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
        headerText={panelHeaderText}
        type={PanelType.medium}
      >
        {panelContext === 'show-query-parameters' && <QueryParameters autoComplete={autoComplete} />}
      </Panel>
    </section>
  );
}

// @ts-ignore
const styledResourceExplorer = styled(ResourceExplorer, sidebarStyles);
export default styledResourceExplorer;
