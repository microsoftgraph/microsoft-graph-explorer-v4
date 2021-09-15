import { Nav, SearchBox, styled } from '@fluentui/react';
import React, { useState } from 'react';
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
  const filteredPayload = filterResourcesByLabel(filterResourcesByLabel(data, ['Prod']), ['v1.0']);

  const [resourceItems, setResourceItems] = useState<IResource[]>(filteredPayload.children);
  const searchValueChanged = (event: any, value?: string) => {
    let filtered: any[] = [...resourceItems];
    if (value) {
      const keyword = value.toLowerCase();
      filtered = resourceItems.filter((sample: IResource) => {
        const name = sample.segment.toLowerCase();
        return name.toLowerCase().includes(keyword);
      });
    }
    setResourceItems(filtered);
  }

  const createList = (source: IResource[]) => {

    function convert(data: IResource): any {
      return {
        key: data.segment,
        name: `${data.segment} ${(data.children) ? `(${data.children.length})` : ''}`,
        url: `#${data.segment}`,
        isExpanded: false,
        target: '_blank',
        links: (data.children) ? data.children.map(convert) : []
      };
    }
    const converted = convert(resources.data);
    return converted.links;
  }

  const items: any = createList(resourceItems);

  return (
    <section>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={searchValueChanged}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />
      <Nav groups={items} />
    </section>
  )
}
// @ts-ignore
const styledResourceExplorer = styled(ResourceExplorer, sidebarStyles);
export default styledResourceExplorer;
