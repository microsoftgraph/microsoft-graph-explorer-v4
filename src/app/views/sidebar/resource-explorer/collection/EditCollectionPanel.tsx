import { Label, makeStyles, tokens } from '@fluentui/react-components';
import { translateMessage } from '../../../../utils/translate-messages';
import { useState } from 'react';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/slices/collections.slice';
import Paths from './Paths';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import CommonCollectionsPanel from './CommonCollectionsPanel';

const useStyles = makeStyles({
  centeredLabel: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh'
  },
  paths: {
    marginBlockStart: tokens.spacingVerticalL,
    height: '80vh'
  }
});

interface EditCollectionPanelProps {
  closePopup: () => void;
}

const EditCollectionPanel: React.FC<EditCollectionPanelProps> = ({ closePopup }) => {
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const { collections } = useAppSelector((state) => state.collections);
  const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];

  const columns = [
    { key: 'url', name: 'Select all', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
    { key: 'scope', name: '', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  };

  const styles = useStyles();

  return (
    <CommonCollectionsPanel
      messageBarText={translateMessage('edit collections')}
      messageBarSpanText={translateMessage('Delete All Selected')}
      primaryButtonText='Delete all selected'
      primaryButtonAction={removeSelectedItems}
      primaryButtonDisabled={selectedItems.length === 0}
      closePopup={closePopup}
    >
      {items && items.length > 0 ? (
        <div className={styles.paths}>
          <Paths
            resources={items}
            columns={columns}
            isSelectable={true}
            onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
          />
        </div>
      ) : (
        <div>
          <Label className={styles.centeredLabel}>
            {translateMessage('No items available')}
          </Label>
        </div>
      )}
    </CommonCollectionsPanel>
  );
};

export default EditCollectionPanel;