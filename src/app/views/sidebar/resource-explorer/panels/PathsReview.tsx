import {
  CommandBar, ICommandBarItemProps, Panel, PanelType, PrimaryButton
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IResourceLink, IResourceMethod } from '../../../../../types/resources';
import { IRootState } from '../../../../../types/root';
import { removeResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { removeCounter } from '../resource-explorer.utils';
import Paths from './Paths';
import { exportCollection } from './postman.util';

export interface IPathsReview {
  isOpen: boolean;
  items: IResourceLink[];
  version: string;
}

const PathsReview = (props: any) => {
  const dispatch = useDispatch();
  const { resources: resourceItems } = useSelector(
    (state: IRootState) => state
  );
  const { paths: items } = resourceItems;
  const { isOpen } = props;
  const headerText = translateMessage('Selected Resources') + ' ' + translateMessage('Preview');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const columns = [
    { key: 'url', name: 'Url', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true },
    { key: 'methods', name: 'Methods', fieldName: 'methods', minWidth: 100, maxWidth: 200, isResizable: true }
  ];

  const generateCollection = () => {
    const list: any[] = [];
    items.forEach((element: any) => {
      const { methods, url, version: pathVersion, name, paths } = element;
      const pathName = removeCounter(name);
      const path = [...paths];
      path.push(pathName);
      path.shift();
      path.unshift(pathVersion);
      methods?.forEach((method: IResourceMethod) => {
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
        <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
          <FormattedMessage id='Download as postman collection' />
        </PrimaryButton>
      </div>
    )
  }

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
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

  const selectItems = (content: IResourceLink[]) => {
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
        {items && <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
        />}
      </Panel>
    </>
  )
}

export default PathsReview;