import { DefaultButton, Label, PrimaryButton } from '@fluentui/react';
import { translateMessage } from '../../../../utils/translate-messages';
import { useState } from 'react';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/slices/collections.slice';
import Paths from './Paths';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import CommonCollectionsPanel from './CommonCollectionsPanel';

interface EditCollectionPanelProps {
  closePopup: () => void;
}

const EditCollectionPanel: React.FC<EditCollectionPanelProps> = ({ closePopup }) => {
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const { collections } = useAppSelector((state) => state.collections);
  const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  };

  return (
    <CommonCollectionsPanel
      messageBarText='edit collections'
      primaryButtonText='Delete all selected'
      primaryButtonAction={removeSelectedItems}
      primaryButtonDisabled={selectedItems.length === 0}
      closePopup={closePopup}
    >
      {items && items.length > 0 ? (
        <div style={{ height: '80vh' }}>
          <Paths
            resources={items}
            columns={columns}
            isSelectable={true}
            onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
          />
        </div>
      ) : (
        <div style={{ height: '80vh' }}>
          <Label
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {translateMessage('No items available')}
          </Label>
        </div>
      )}
    </CommonCollectionsPanel>
  );
};

export default EditCollectionPanel;