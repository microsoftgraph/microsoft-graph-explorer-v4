import { DefaultButton, DialogFooter, Dropdown, IDropdownOption, Label, PrimaryButton } from '@fluentui/react';
import { translateMessage } from '../../../../utils/translate-messages';
import { useState } from 'react';
import { IResourceLink } from '../../../../../types/resources';
import { updateResourcePaths } from '../../../../services/slices/collections.slice';
import Paths from './Paths';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { PERMS_SCOPE } from '../../../../services/graph-constants';
import { scopeOptions } from './collection.util';

interface EditScopePanelProps {
    closePopup: () => void;
  }

  const EditScopePanel: React.FC<EditScopePanelProps> = ({closePopup}) => {
    const dispatch = useAppDispatch();
    const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);
    const [selectedScope, setSelectedScope] = useState<PERMS_SCOPE | undefined>();
    const { collections } = useAppSelector(
        (state) => state
      );
      const items = collections && collections.length >
        0 ? collections.find(k => k.isDefault)!.paths : [];

    const columns = [
        { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
        { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
      ];

    const handleScopeChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setSelectedScope(option?.key as PERMS_SCOPE);
    };
      const saveAllScopes = () => {
        if (selectedScope) {
            const updatedItems = items.map(item =>
                selectedItems.some(selected => selected.key === item.key) ? {...item, scope:selectedScope} : item );
            dispatch(updateResourcePaths(updatedItems));
            setSelectedItems([]);
        }
    };

    return (
        <>
        <div style={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0px'
            }}>
            <Label style={{ marginRight: '16px' }}>{translateMessage('Change scope to: ')}</Label>
            <Dropdown
            options={scopeOptions}
            onChange={handleScopeChange}
            styles={{ dropdown: { width: 200 } }}
            />
        </div>
        <div style={{ height: '80vh' }}>
            <Paths
            resources={items}
            columns={columns}
            isSelectable={true}
            onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
            />
            </div>
            <DialogFooter
            styles={{
                actionsRight: { bottom: 0, justifyContent: 'start' }
                }}>
                    <PrimaryButton onClick={saveAllScopes} disabled={!selectedScope || selectedItems.length === 0}>
                        {translateMessage('Save all')}
                    </PrimaryButton>

                    <DefaultButton onClick={closePopup}>
                        {translateMessage('Close')}
                    </DefaultButton>
            </DialogFooter>
        </>
    );
};

export default EditScopePanel;