import {
  CommandBar, ICommandBarItemProps, Label, Panel, PanelType, PrimaryButton
} from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { IResourceLink } from '../../../../../types/resources';
import { IRootState } from '../../../../../types/root';
import { removeResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  isOpen: boolean;
  version: string;
  toggleSelectedResourcesPreview: Function;
}

const PathsReview = (props: IPathsReview) => {
  const dispatch = useDispatch();
  const { resources: { paths } } = useSelector(
    (state: IRootState) => state
  );
  const { isOpen } = props;
  const headerText = translateMessage('Selected Resources') + ' ' + translateMessage('Preview');
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true }
  ];

  const items = paths.filter(item => item.method);

  const generateCollection = () => {
    const content = generatePostmanCollection(items);
    const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
    downloadToLocal(content, filename);
  }

  const renderFooterContent = () => {
    return (
      <div>
        <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
          <FormattedMessage id='Download postman collection' />
        </PrimaryButton>
      </div>
    )
  }

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
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
        onDismiss={() => props.toggleSelectedResourcesPreview()}
        type={PanelType.large}
        onRenderFooterContent={renderFooterContent}
        closeButtonAriaLabel='Close'
      >
        <Label>
          <FormattedMessage id='You can export the entire list as a Postman Collection. If there are items in the list you would not want, select them to remove' />
        </Label>
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