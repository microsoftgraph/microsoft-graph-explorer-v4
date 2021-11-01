import { DetailsRow, GroupedList, IGroup, Label, Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { generateGroupsFromList } from '../../../utils/generate-groups';
import { translateMessage } from '../../../utils/translate-messages';
import { classNames } from '../../classnames';

const QueryParameters = (props: any) => {
  const { autoComplete } = props;
  const { pending } = autoComplete;

  const classes = classNames(props);

  if (pending) {
    return <Spinner
      className={classes.spinner}
      size={SpinnerSize.large}
      label={`${translateMessage('Loading parameters')} ...`}
      ariaLive='assertive'
      labelPosition='top'
    />
  }

  const { data: { parameters } } = autoComplete;

  const items: any[] = [];
  const list: IGroup[] = [];
  const groups: any[] = [];
  const columns = [{
    key: 'name',
    name: 'name',
    fieldName: 'name',
    minWidth: 300
  }];

  const generateChildren = (values: any[], parent: string) => {
    const listItems: IGroup[] = [];
    values.forEach((parameter: any, index: number) => {
      parameter.items.forEach((item: string) => {
        items.push({
          category: parameter.name,
          key: `${parent}-${parameter.name}-${item}`,
          name: item,
          parent
        })
      });
      listItems.push({
        key: parameter.name,
        name: parameter.name,
        startIndex: index,
        count: parameter.items.length,
        level: 1
      });
    });
    return listItems;
  }

  parameters.forEach((parameter: any, index: number) => {
    const children = generateChildren(parameter.values, parameter.verb);
    const totalCount = children.reduce((n, { count }) => n + count, 0);
    list.push({
      key: parameter.verb,
      name: parameter.verb,
      startIndex: (index === 0) ? index : list[index - 1].count,
      count: totalCount,
      level: 0,
      children
    });
  });

  const generatedGroups = generateGroupsFromList(items, 'category');
  generatedGroups.forEach(group => {
    group.level = 1
  });

  parameters.forEach((parameter: any, index: number) => {
    const { verb } = parameter;

    groups.push({
      key: verb,
      name: verb,
      startIndex: (index === 0) ? index : list[index - 1].count,
      count: items.filter(k => k.parent === verb).length,
      level: 0,
      children: generatedGroups.filter((k: any) => k.parent === verb)
    })
  });

  const onRenderCell = (
    nestingDepth?: number,
    item?: any,
    itemIndex?: number,
    group?: IGroup,
  ): React.ReactNode => {
    return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
      <DetailsRow
        columns={columns}
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex}
        group={group}
      />
    ) : null;
  };

  return (
    <section>
      <Label><FormattedMessage id="Query parameters" /></Label>
      <GroupedList
        items={items}
        onRenderCell={onRenderCell}
        groups={groups}
        groupProps={{
          showEmptyGroups: true
        }}
      />
    </section>
  );
}

export default QueryParameters;
