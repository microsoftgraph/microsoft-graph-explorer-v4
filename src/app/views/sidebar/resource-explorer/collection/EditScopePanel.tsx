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
    const [selectedScope, setSelectedScope] = useState<PERMS_SCOPE | undefined>();
    const [pendingChanges, setPendingChanges] = useState<IResourceLink[]>([]);
    const { collections, saved } = useAppSelector((state) => state.collections);
    const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];

    useEffect(() => {
        if (saved) {
            setSelectedItems([]);
            setSelectedScope(undefined);
            setPendingChanges([]);
        }
    }, [saved]);

    const columns = [
        { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
        { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
    ];

    const handleScopeChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        const newScope = option?.key as PERMS_SCOPE;
        setSelectedScope(newScope);
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
        <>
            <MessageBar isMultiline={true}>
                {translateMessage('edit query scopes')}
                <span style={{ fontWeight: 'bold' }}>{translateMessage('Save all')}</span>
            </MessageBar>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0px' }}>
                <Label style={{ marginRight: '16px' }}>{translateMessage('Change scope to: ')}</Label>
                <Dropdown
                    placeholder={translateMessage('[Select one scope]')}
                    options={scopeOptions.map(option =>
                        ({ key: option.key, text: formatScopeLabel(option.key as PERMS_SCOPE) }))}
                    onChange={handleScopeChange}
                    selectedKey={selectedScope}
                    styles={{ dropdown: { width: 200 } }}
                />
            </div>
            <div style={{ height: '80vh' }}>
                <Paths
                    resources={items.map(item => pendingChanges.find(change => change.key === item.key) || item)}
                    columns={columns}
                    isSelectable={true}
                    onSelectionChange={(selected) => setSelectedItems(selected as IResourceLink[])}
                />
            </div>

            <DialogFooter styles={{ actionsRight: { bottom: 0, justifyContent: 'start' } }}>
                <PrimaryButton onClick={saveAllScopes} disabled={pendingChanges.length === 0}>
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