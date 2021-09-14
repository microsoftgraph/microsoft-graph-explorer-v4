import { DetailsRow, GroupedList, IGroup, SearchBox, SelectionMode, styled } from '@fluentui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { IResource } from '../../../../types/resources';
import { IRootState } from '../../../../types/root';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';
import { sidebarStyles } from '../Sidebar.styles';


const ResourceExplorer = (props: any) => {
  const { resources } = useSelector(
    (state: IRootState) => state
  );
  const classes = classNames(props);

  const { data } = resources;
  const [resourceItems, setResourceItems] = useState<IResource[]>(data.children);
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

  const createListItems = (source: IResource[]) => {
    return source;
  }

  const items = createListItems(resourceItems);
  const columns = [
    {
      key: 'segment',
      name: 'segment',
      fieldName: 'segment',
      minWidth: 300,
    },
    {
      key: 'children',
      name: 'children',
      fieldName: 'children',
      minWidth: 300,
    }
  ]

  const onRenderCell = (nestingDepth?: number, item?: any, itemIndex?: number, group?: IGroup): JSX.Element => {
    const content = {
      segment: item.segment,
      children: (item.children) ? item.children.length : 0,
      label: (item.label) ? item.label.length : 0
    }
    return (
      <DetailsRow
        columns={columns}
        className={classes.queryRow}
        groupNestingDepth={nestingDepth}
        item={content}
        itemIndex={itemIndex!}
        group={group}
      />
    );
  };

  return (
    <section>
      <SearchBox
        placeholder={translateMessage('Search resources')}
        onChange={searchValueChanged}
        styles={{ field: { paddingLeft: 10 } }}
      />
      <hr />
      <GroupedList
        items={items}
        className={classes.queryList}
        onRenderCell={onRenderCell}
        selectionMode={SelectionMode.multiple}
      />
    </section>
  )
}
// @ts-ignore
const styledResourceExplorer = styled(ResourceExplorer, sidebarStyles);
export default styledResourceExplorer;
