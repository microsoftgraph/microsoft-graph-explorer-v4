import {
  CommandBar, DialogFooter, getTheme, ICommandBarItemProps,
  Label, PrimaryButton
} from '@fluentui/react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  version: string;
}

const PathsReview: React.FC<PopupsComponent<IPathsReview>> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { resources: { paths: items } } = useAppSelector(
    (state) => state
  );
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

  return (
    <>
      <Label>
        <FormattedMessage id='Export list as a Postman collection message' />
      </Label>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
      />
      {items && <>
        <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
        />
        <DialogFooter>
          <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
            <FormattedMessage id='Download postman collection' />
          </PrimaryButton>
        </DialogFooter>
      </>
      }
    </>
  )
}

export default PathsReview;