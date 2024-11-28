import { DefaultButton,
  DialogFooter,
  Dropdown,
  IDropdownOption,
  Label,
  MessageBar,
  PrimaryButton } from '@fluentui/react';
import { translateMessage } from '../../../../utils/translate-messages';
import { useEffect, useState } from 'react';
import { IResourceLink } from '../../../../../types/resources';
import { resetSaveState, updateResourcePaths } from '../../../../services/slices/collections.slice';
import Paths from './Paths';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { PERMS_SCOPE } from '../../../../services/graph-constants';
import { formatScopeLabel, scopeOptions } from './collection.util';

interface EditScopePanelProps {
    closePopup: () => void;
}

const EditScopePanel: React.FC<EditScopePanelProps> = ({ closePopup }) => {
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
  const [selectedScope, setSelectedScope] = useState<PERMS_SCOPE | null>(null);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [pendingChanges, setPendingChanges] = useState<IResourceLink[]>([]);
  const { collections, saved } = useAppSelector((state) => state.collections);
  const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];

  useEffect(() => {
    if (saved) {
      setSelectedItems([]);
      setSelectedScope(null);
      setPendingChanges([]);
    }
  }, [saved]);

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  const handleScopeChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) {return;}
    const newScope = option.key as PERMS_SCOPE;
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
    setSelectedScope(null);
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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column',
      overflow: 'hidden' }}>
      <MessageBar isMultiline={true}>
        {translateMessage('edit query scopes')}
        <span style={{ fontWeight: 'bold' }}>{translateMessage('Save all')}</span>
      </MessageBar>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0px' }}>
        <Label style={{ marginRight: '16px' }}>{translateMessage('Change scope to: ')}</Label>
        <Dropdown
          key={dropdownKey}
          placeholder={translateMessage('[Select one scope]')}
          options={scopeOptions.map(option =>
            ({ key: option.key, text: formatScopeLabel(option.key) }))}
          onChange={handleScopeChange}
          selectedKey={selectedScope}
          disabled={selectedItems.length === 0}
          styles={{ dropdown: { width: 200 } }}
        />
      </div>
      <div style={{ flex: 1, marginBottom: '1px',  maxHeight: '80vh' }}>
        <Paths
          resources={items.map(item => pendingChanges.find(change => change.key === item.key) || item)}
          columns={columns}
          isSelectable={true}
          onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
        />
      </div>

      <DialogFooter
        styles={{
          actionsRight: {
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '5px'
          }
        }}>
        <PrimaryButton onClick={saveAllScopes} disabled={pendingChanges.length === 0}>
          {translateMessage('Save all')}
        </PrimaryButton>
        <DefaultButton onClick={closePopup}>
          {translateMessage('Close')}
        </DefaultButton>
      </DialogFooter>
    </div>
  );
};

export default EditScopePanel;
