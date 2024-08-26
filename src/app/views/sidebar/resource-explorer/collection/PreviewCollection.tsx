import {
  CommandBar, DialogFooter, ICommandBarItemProps, Label, PrimaryButton
} from '@fluentui/react';
import { useEffect, useState } from 'react';

import { AppDispatch, useAppDispatch, useAppSelector } from '../../../../../store';
import { IResourceLink } from '../../../../../types/resources';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { removeResourcePaths } from '../../../../services/slices/collections.slice';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  version: string;
}

const PathsReview: React.FC<PopupsComponent<IPathsReview>> = (props) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { collections } = useAppSelector(
    (state) => state
  );
  const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true }
  ];

  const generateCollection = () => {
    const content = generatePostmanCollection(items);
    const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
    downloadToLocal(content, filename);
  }

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  }

  const options: ICommandBarItemProps[] = [
    {
      key: 'remove',
      text: translateMessage('remove'),
      iconProps: { iconName: 'Delete' },
      disabled: selectedItems.length === 0,
      onClick: () => removeSelectedItems()
    }
  ];

  const selectItems = (content: IResourceLink[]) => {
    setSelectedItems(content);
  };

  useEffect(() => {
    if (items.length === 0) {
      props.closePopup();
    }
  }, [items]);

  return (
    <>
      <Label>
        {translateMessage('Export list as a Postman collection message')}
      </Label>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
      />
      {items && items.length > 0 && <>
        <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
        />
        <DialogFooter styles={{ actionsRight: { justifyContent: 'start' } }}>
          <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
            {translateMessage('Download postman collection')}
          </PrimaryButton>
        </DialogFooter>
      </>
      }
    </>
  )
}

export default PathsReview;