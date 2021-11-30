import {
  DetailsRow, GroupedList, IGroup,
  INavLink, Label, Spinner, SpinnerSize
} from '@fluentui/react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { IResourceLink } from '../../../../../types/resources';

import { IRootState } from '../../../../../types/root';
import { fetchAutoCompleteOptions } from '../../../../services/actions/autocomplete-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { getUrlFromLink } from '../resource-explorer.utils';

interface IQueryParametersProps {
  version: string;
  context: IResourceLink;
}

const QueryParameters = (props: IQueryParametersProps) => {

  const { autoComplete } = useSelector(
    (state: IRootState) => state
  );
  const { pending, data } = autoComplete;
  const { context, version } = props;

  const dispatch = useDispatch();

  const requestUrl = getUrlFromLink(context);

  useEffect(() => {
    if (!data && !pending || (data?.url !== requestUrl)) {
      dispatch(fetchAutoCompleteOptions(requestUrl, version))
    }
  }, [requestUrl]);

  if (pending) {
    return <Spinner
      size={SpinnerSize.large}
      label={`${translateMessage('Loading parameters')} ...`}
      ariaLive='assertive'
      labelPosition='top'
    />
  }

  if (!data) {
    return (<div />);
  }

  const items: any[] = []; let groups: IGroup[] = [];
  const columns = [{
    key: 'name',
    name: 'name',
    fieldName: 'name',
    minWidth: 300
  }];

  const flattenList = (parameter: any, name: any, parent: string) => {
    parameter.items.forEach((item: string) => {
      items.push({
        category: name,
        key: `${parent}-${name}-${item}`,
        name: item,
        parent
      });
    });
  }

  const generateChildren = (values: any[], parent: string) => {
    const listItems: IGroup[] = [];
    values.forEach((parameter: any, index: number) => {
      const { name } = parameter;
      listItems.push({
        key: name,
        name,
        startIndex: index,
        count: parameter.items.length,
        isCollapsed: true,
        level: 0
      });
      flattenList(parameter, name, parent);
    });
    return listItems;
  }

  if (data) {
    const { parameters } = data;
    const odataParameters = parameters.find(k => k.verb.toLowerCase() === 'get');
    groups = generateChildren(odataParameters!.values, odataParameters!.verb);
  }

  const onRenderCell = (depth?: number, item?: any, index?: number, group?: IGroup): React.ReactNode => {
    return item && typeof index === 'number' && index > -1 ? (
      <DetailsRow
        columns={columns}
        groupNestingDepth={depth}
        item={item}
        itemIndex={index}
        group={group}
      />
    ) : null;
  };

  return (
    <section>
      <Label><FormattedMessage id='Query parameters' /></Label>
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
