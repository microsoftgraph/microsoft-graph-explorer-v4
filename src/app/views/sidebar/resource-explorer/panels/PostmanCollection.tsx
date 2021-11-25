import {
  Panel, PanelType, DetailsList, DetailsListLayoutMode,
  PrimaryButton, getId, IColumn, TooltipHost, CommandBar, ICommandBarItemProps
} from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IResourceLabel } from '../../../../../types/resources';
import { translateMessage } from '../../../../utils/translate-messages';
import { flatten, getUrlFromLink } from '../resource-explorer.utils';

const PostmanCollection = (props: any) => {
  const { isOpen, items, version } = props;
  const headerText = translateMessage('Selected Resources') + ' ' + translateMessage('Preview');

  const columns = [
    { key: 'url', name: 'Url', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true },
    { key: 'methods', name: 'Methods', fieldName: 'methods', minWidth: 100, maxWidth: 200, isResizable: true }
  ];
  const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
    if (column) {
      const itemContent = item[column.fieldName as keyof any] as string;

      switch (column.key) {
        case 'methods':
          return item.methods.map((method: any, key: number) => (
            <span key={key}
              style={{
                textAlign: 'center',
                display: 'inline-flex',
                marginRight: 6
              }}
            >
              {method.name}
            </span>
          ));

        default:
          return (
            <TooltipHost
              tooltipProps={{
                content: item.url
              }}
              id={getId()}
              calloutProps={{ gapSpace: 0 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              {itemContent}
            </TooltipHost>
          );
      }
    }
  };

  const paths = getPaths(items, version);

  const generatePostmanCollection = () => {
    alert('generated');
  }

  const renderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={generatePostmanCollection}>
          <FormattedMessage id='Download as postman collection' />
        </PrimaryButton>
      </div>
    )
  }

  const options: ICommandBarItemProps[] = [
    {
      key: 'remove',
      text: translateMessage('Remove'),
      iconProps: { iconName: 'Delete' },
      disabled: true,
      onClick: () => console.log('delete from tree')
    }
  ];

  return (
    <>
      <Panel
        headerText={`${headerText}`}
        isOpen={isOpen}
        onDismiss={props.toggleSelectedResourcesPreview}
        type={PanelType.large}
        onRenderFooterContent={renderFooterContent}
        closeButtonAriaLabel='Close'
      >
        <CommandBar
          items={options}
          ariaLabel='Selection actions'
          primaryGroupAriaLabel='Selection actions'
          farItemsGroupAriaLabel='More selection actions'
        />
        <DetailsList
          compact={true}
          items={paths}
          onRenderItemColumn={renderItemColumn}
          columns={columns}
          setKey='set'
          layoutMode={DetailsListLayoutMode.fixedColumns}
        />
      </Panel>
    </>
  )
}

function getPaths(items: any, version: string) {
  const links = items[0].links
  const content = flatten(links).filter(k => k.type === 'path');
  if (content.length > 0) {
    content.forEach(element => {
      const methods = element.labels.find((k: IResourceLabel) => k.name === version)?.methods || [];
      const listOfMethods: any[] = [];
      methods.forEach((method: string) => {
        listOfMethods.push({
          name: method.toUpperCase(),
          checked: true
        });
      });
      element.version = version;
      element.url = `${getUrlFromLink(element)}`;
      element.methods = listOfMethods;
    });
  }
  return content;
}
export default PostmanCollection;