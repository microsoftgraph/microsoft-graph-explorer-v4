import { ChoiceGroup, IChoiceGroupOption, INavLink, INavLinkGroup, Label, Nav, SearchBox, styled } from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { IResource } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { filterResourcesByLabel } from '../../../utils/resources/resource-payload-filter';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';

const ResourceExplorer = (props: any) => {
  const { resources } = useSelector(
    (state: IRootState) => state
  );
  const classes = classNames(props);
  const { data } = resources;
  const versions: IChoiceGroupOption[] = [
    { key: 'v1.0', text: 'v1.0', iconProps: { iconName: 'CloudWeather' } },
    { key: 'beta', text: 'beta', iconProps: { iconName: 'PartlyCloudyNight' } }
  ];

  const [version, setVersion] = useState(versions[0].key);
  const [searchText, setSearchText] = useState<string>('');

  const filterDataByVersion = (info: IResource, selectedVersion: string) => {
    return filterResourcesByLabel(filterResourcesByLabel(info, ['Prod']), [selectedVersion]);
  }

  const filteredPayload = filterDataByVersion(data, version);
  const [resourceItems, setResourceItems] = useState<IResource[]>(filteredPayload.children);

  const createList = (source: IResource[]) => {
    function getIcon({ segment, children }: IResource) {
      const graphFunction = segment.includes('microsoft.graph');
      let icon = null;
      if (graphFunction) {
        icon = 'LightningBolt';
      }
      if (!graphFunction && !children) {
        icon = 'PlugDisconnected';
      }
      return icon;
    }

    function createNavLink(info: IResource): any {
      const { segment, children } = info;
      const name = `${segment} ${(children) ? `(${children.length})` : ''}`;
      return {
        key: segment,
        name,
        isExpanded: false,
        icon: getIcon(info),
        links: (children) ? children.map(createNavLink) : []
      };
    }

    const converted = createNavLink({
      segment: '/',
      label: [],
      children: source
    });

    return [
      {
        isExpanded: false,
        links: converted.links
      }
    ];
  }

  const performSearch = (needle: string, haystack: any[]) => {
    const keyword = needle.toLowerCase();
    return haystack.filter((sample: IResource) => {
      const name = sample.segment.toLowerCase();
      return name.toLowerCase().includes(keyword);
    });
  }

  const clickLink = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev!.preventDefault();
    if (item && item.name) {
      alert(item.name + ' link clicked');
    }
  }

  const changeVersion = (ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option: IChoiceGroupOption | undefined): void => {
    const selectedVersion = option!.key;
    setVersion(selectedVersion);
    const list = filterDataByVersion(data, selectedVersion);
    setResourceItems((searchText) ? performSearch(searchText, list.children) : list.children);
  }

  const changeSearchValue = (event: any, value?: string) => {
    let filtered: any[] = [...data.children];
    setSearchText(value || '');
    if (value) {
      filtered = performSearch(value, filtered);
    }
    setResourceItems(filterDataByVersion({
      children: filtered,
      label: data.label,
      segment: data.segment
    }, version).children);
  }

  const items: INavLinkGroup[] = createList(resourceItems);
  const navStyles: any = (properties: any) => ({
    chevronIcon: [
      properties.isExpanded && {
        transform: `rotate(0deg)`
      },
      !properties.isExpanded && {
        transform: `rotate(-90deg)`
      }
    ]
  });

  return (
    <section>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={changeSearchValue}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />
      <ChoiceGroup
        label={translateMessage('Select version')}
        defaultSelectedKey={version}
        options={versions}
        onChange={changeVersion}
      />;
      <Label>
        <FormattedMessage id='Resources available' />
      </Label>
      <Nav
        groups={items}
        onLinkClick={clickLink}
        styles={navStyles}
        className={classes.queryList} />
    </section>
  )
}

// @ts-ignore
const styledResourceExplorer = styled(ResourceExplorer, sidebarStyles);
export default styledResourceExplorer;
