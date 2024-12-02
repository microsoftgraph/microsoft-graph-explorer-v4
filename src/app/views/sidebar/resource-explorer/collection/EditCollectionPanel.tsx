import { DefaultButton, DialogFooter, Label, MessageBar, PrimaryButton } from '@fluentui/react';
import { translateMessage } from '../../../../utils/translate-messages';
import { useState } from 'react';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/slices/collections.slice';
import Paths from './Paths';
import { useAppDispatch, useAppSelector } from '../../../../../store';

interface EditCollectionPanelProps {
    closePopup: () => void;
  }

const EditCollectionPanel: React.FC<EditCollectionPanelProps> = ({closePopup}) => {
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const { collections } = useAppSelector(
    (state) => state.collections
  );
  const items = collections && collections.length >
        0 ? collections.find(k => k.isDefault)!.paths : [];

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  };

  return (
    <>
      <MessageBar isMultiline={true}>
        {translateMessage('edit collections')}
        <span style={{ fontWeight: 'bold' }}>{translateMessage('Delete all selected')}</span>
      </MessageBar>
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
        <div style={{height: '80vh'}}>
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
      <DialogFooter
        styles={{
          actionsRight: { bottom: 0, justifyContent: 'start' }
        }}>
        <PrimaryButton onClick={removeSelectedItems} disabled={selectedItems.length === 0}>
          {translateMessage('Delete all selected')}
        </PrimaryButton>

        <DefaultButton onClick={closePopup}>
          {translateMessage('Close')}
        </DefaultButton>
      </DialogFooter>
    </>
  );
};

export default EditCollectionPanel;