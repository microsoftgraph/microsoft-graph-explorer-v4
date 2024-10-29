import { DefaultButton, DialogFooter, Label, PrimaryButton } from '@fluentui/react';
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
        (state) => state
      );
      const items = collections && collections.length >
        0 ? collections.find(k => k.isDefault)!.paths : [];

    const columns = [
        { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true },
        { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 300, maxWidth: 350, isResizable: true }
      ];

    const removeSelectedItems = () => {
        dispatch(removeResourcePaths(selectedItems));
        setSelectedItems([]);
    };

    return (
        <>
        {items && items.length > 0 ? (
         <div>
         <Paths
           resources={items}
           columns={columns}
           // eslint-disable-next-line @typescript-eslint/no-empty-function
           setSelectedScope={() => {}}
           isSelectable={true}
           onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
         />
       </div>
     ) : (
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