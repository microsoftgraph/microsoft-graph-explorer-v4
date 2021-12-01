import {
  DetailsList,
  DetailsListLayoutMode,
  getId, getTheme, IColumn, Label, SelectionMode, Spinner, SpinnerSize, Stack, TooltipHost
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

  const items: any[] = [];
  const columns = [
    {
      key: 'name',
      name: 'name',
      fieldName: 'name',
      minWidth: 50,
      maxWidth: 100,
      isResizable: true
    },
    {
      key: 'properties',
      name: 'Properties',
      fieldName: 'properties',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }
  ];

  if (data) {
    const { parameters } = data;
    const odataParameters = parameters.find(k => k.verb.toLowerCase() === 'get');
    if (odataParameters) {
      odataParameters.values.forEach(element => {
        items.push(element);
      });
    }
  }

  const theme = getTheme();

  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    if (column) {
      const itemContent = item[column.fieldName as keyof any] as string;
      if (column.key === 'properties') {
        if (item.items.length > 0) {
          return (
            <Stack horizontal wrap
              styles={{
                root: {
                  width: 420
                }
              }}
              tokens={{
                childrenGap: 5,
                padding: 10

              }}>
              {getLabels()}
            </Stack>
          );
        }
      }

      return (
        <TooltipHost
          tooltipProps={{
            content: item.name
          }}
          id={getId()}
          calloutProps={{ gapSpace: 0 }}
          styles={{ root: { display: 'inline-block' } }}
        >
          {itemContent}
        </TooltipHost>
      );
    }

    function getLabels() {
      return item.items.map((value: any, key: number) => (
        <span key={key} style={{
          padding: 6,
          border: '1px solid ' + theme.palette.neutralPrimary
        }} >
          {value}
        </span>
      ));
    }
  }

  return (
    <section>
      <Label><FormattedMessage id='Query parameters' /></Label>
      <DetailsList
        items={items}
        columns={columns}
        setKey='set'
        onRenderItemColumn={renderItemColumn}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        selectionPreservedOnEmptyClick={true}
        ariaLabelForSelectionColumn='Toggle selection'
        ariaLabelForSelectAllCheckbox='Toggle selection for all items'
        checkButtonAriaLabel='select row'
      />
    </section>
  );
}

export default QueryParameters;
