import {
  CommandBar, ICommandBarItemProps, Panel, PanelType, PrimaryButton
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { IResourceLabel } from '../../../../../types/resources';
import { translateMessage } from '../../../../utils/translate-messages';
import { flatten, getUrlFromLink, removeCounter } from '../resource-explorer.utils';
import Paths from './Paths';
import { exportCollection } from './postman.util';

const PathsReview = (props: any) => {
  const { isOpen, items, version } = props;
  const headerText = translateMessage('Selected Resources') + ' ' + translateMessage('Preview');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [resources, setResources] = useState(getResourcePaths(items, version))

  const columns = [
    { key: 'url', name: 'Url', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true },
    { key: 'methods', name: 'Methods', fieldName: 'methods', minWidth: 100, maxWidth: 200, isResizable: true }
  ];

  const generateCollection = () => {
    const list: any[] = [];
    resources.forEach(element => {
      const { methods, url, version: pathVersion, name, paths } = element;
      const pathName = removeCounter(name);
      const path = [...paths];
      path.push(pathName);
      path.shift();
      methods.forEach((method: any) => {
        list.push({
          method: method.name,
          name: `${pathName}-${method.name}`,
          url,
          version: pathVersion,
          path
        })
      });
    });
    exportCollection(list);
  }

  const renderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={generateCollection}>
          <FormattedMessage id='Download as postman collection' />
        </PrimaryButton>
      </div>
    )
  }

  const removeSelectedItems = () => {
    const arr = [...resources];
    for (let i = 0; i < selectedItems.length; i++) {
      arr.splice(i, 1);
    }
    setResources(arr);
  }

  const options: ICommandBarItemProps[] = [
    {
      key: 'remove',
      text: translateMessage('Remove'),
      iconProps: { iconName: 'Delete' },
      disabled: selectedItems.length === 0,
      onClick: () => removeSelectedItems()
    }
  ];

  const selectItems = (content: any[]) => {
    setSelectedItems(content);
  };

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
        {resources && <Paths
          resources={resources}
          columns={columns}
          selectItems={selectItems}
        />}
      </Panel>
    </>
  )
}

function getResourcePaths(items: any, version: string) {
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
export default PathsReview;