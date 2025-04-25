import {
  Dropdown,
  Label,
  makeStyles,
  Option,
  useId
} from '@fluentui/react-components';
import { translateMessage } from '../../../../utils/translate-messages';
import React, { useEffect, useState, useRef } from 'react';
import { IResourceLink } from '../../../../../types/resources';
import { resetSaveState, updateResourcePaths } from '../../../../services/slices/collections.slice';
import Paths from './Paths';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { PERMS_SCOPE } from '../../../../services/graph-constants';
import { formatScopeLabel, scopeOptions } from './collection.util';
import CommonCollectionsPanel from './CommonCollectionsPanel';

const useStyles = makeStyles({
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '10px 0px'
  },
  dropdown: {
    width: '200px'
  }
});

interface EditScopePanelProps {
  closePopup: () => void;
}

const EditScopePanel: React.FC<EditScopePanelProps> = ({ closePopup }) => {
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [pendingChanges, setPendingChanges] = useState<IResourceLink[]>([]);
  const { collections, saved } = useAppSelector((state) => state.collections);
  const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const styles = useStyles();
  const dropdownId = useId('dropdown-scope');
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (saved) {
      setSelectedItems([]);
      setPendingChanges([]);
    }
  }, [saved]);

  useEffect(() => {
    if (selectedItems.length > 0 && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [selectedItems]);

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScopeChange = (_event: any, option?: any) => {
    if (!option) { return; }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newScope = option.optionValue as PERMS_SCOPE;
    const updatedSelectedItems = selectedItems.map(item => ({ ...item, scope: newScope }));
    setSelectedItems(updatedSelectedItems);
    const newPendingChanges = [...pendingChanges];
    updatedSelectedItems.forEach(updatedItem => {
      const index = newPendingChanges.findIndex(item => item.key === updatedItem.key);
      if (index > -1) {
        newPendingChanges[index] = updatedItem;
      } else {
        newPendingChanges.push(updatedItem);
      }
    });
    setPendingChanges(newPendingChanges);
    setDropdownKey(prevKey => prevKey + 1);
  };

  const saveAllScopes = () => {
    if (pendingChanges.length > 0) {
      dispatch(resetSaveState());

      const updatedItems = items.map(item =>
        pendingChanges.find(changedItem => changedItem.key === item.key) || item
      );

      dispatch(updateResourcePaths(updatedItems));
    }
    setPendingChanges([]);
  };

  return (
    <CommonCollectionsPanel
      messageBarText={translateMessage('edit query scopes')}
      messageBarSpanText={translateMessage('Save all')}
      primaryButtonText='Save all'
      primaryButtonAction={saveAllScopes}
      primaryButtonDisabled={pendingChanges.length === 0}
      closePopup={closePopup}
    >
      <div className={styles.dropdownContainer}>
        <Label id={dropdownId} style={{ marginRight: '16px' }}>{translateMessage('Change scope to: ')}</Label>
        <Dropdown
          key={dropdownKey}
          aria-labelledby={dropdownId}
          placeholder={translateMessage('[Select one scope]')}
          onOptionSelect={handleScopeChange}
          disabled={selectedItems.length === 0}
          className={styles.dropdown}
          aria-label={translateMessage('Select one scope')}
          ref={dropdownRef}
        >
          {scopeOptions.map(option => (
            <Option key={option.key} value={option.key}>
              {formatScopeLabel(option.text)}
            </Option>
          ))}
        </Dropdown>
      </div>
      <Paths
        resources={items.map(item => pendingChanges.find(change => change.key === item.key) || item)}
        columns={columns}
        isSelectable={true}
        onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
      />
    </CommonCollectionsPanel>
  );
};

export default EditScopePanel;
