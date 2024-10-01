import {
  CommandBar,
  DefaultButton,
  DialogFooter, ICommandBarItemProps,
  Label, PrimaryButton
} from '@fluentui/react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IResourceLink, ResourcePath } from '../../../../../types/resources';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { removeResourcePaths, updateResourcePaths } from '../../../../services/slices/collections.slice';
import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { scopeOptions } from './collection.util';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  version: string;
}

const PathsReview: React.FC<PopupsComponent<IPathsReview>> = (props) => {
  const dispatch = useAppDispatch();
  const { show: viewPermissions } = usePopups('collection-permissions', 'panel');
  const { collections } = useAppSelector(
    (state) => state
  );
  const items = collections && collections.length >
    0 ? collections.find(k => k.isDefault)!.paths : [];

  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 300, maxWidth: 350, isResizable: true }
  ];

  const generateCollection = () => {
    const content = generatePostmanCollection(items);
    const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
    downloadToLocal(content, filename);
    trackDownload(filename, componentNames.DOWNLOAD_POSTMAN_COLLECTION_BUTTON);
  }

  function trackDownload(filename: string, componentName: string) {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      componentName,
      filename
    });
  }

  const removeSelectedItems = () => {
    dispatch(removeResourcePaths(selectedItems));
    setSelectedItems([]);
  }

  const options: ICommandBarItemProps[] = [
    {
      key: 'remove',
      text: translateMessage('Edit collection'),
      iconProps: { iconName: 'Delete' },
      disabled: selectedItems.length === 0,
      onClick: () => removeSelectedItems()
    },
    {
      key: 'set-scope',
      text: translateMessage('Edit scope'),
      iconProps: { iconName: 'Permissions' },
      disabled: selectedItems.length === 0,
      subMenuProps: {
        items: scopeOptions.map((option) => {
          return {
            key: option.key, text: option.text,
            onClick: () => bulkSelectScope(option.key as string)
          }
        })
      }
    },
    {
      key: 'upload',
      text: translateMessage('Upload a new list'),
      iconProps: { iconName: 'Upload' }
      //onClick: () => {}
    }
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'preview-permissions',
      text: translateMessage('Preview permissions'),
      iconProps: { iconName: 'ListMirrored' },
      disabled: selectedItems.length === 0,
      onClick: () => viewPermissions({
        settings: {
          title: translateMessage('Required Permissions')
        }
      })}
  ];

  const selectItems = (content: IResourceLink[]) => {
    setSelectedItems(content);
  };

  const setSelectedScope = (resource: ResourcePath, scope: string): void => {
    const itemResources = items.map(item =>
      item.key === resource.key ? { ...item, scope } : item
    );
    dispatch(updateResourcePaths(itemResources));
    setSelectedItems([]);
  };


  const bulkSelectScope = (scope: string): void => {
    const itemResources = items.map(item => {
      const selectedItem = selectedItems.find(resource => resource.key === item.key);
      return selectedItem ? { ...item, scope } : item;
    });
    dispatch(updateResourcePaths(itemResources));
    setSelectedItems([]);
  };


  return (
    <>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
        farItems={farItems}
      />

      {items && items.length > 0 && <div style={{ height: '80vh' }}>
        <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
          setSelectedScope={setSelectedScope}
        />
      </div>
      }
      {
        <Label
          style={{ display: 'flex', width: '100%',
            height: '80vh',
            justifyContent: 'center',
            alignItems: 'center' }}>
          {translateMessage('Add queries in the Resources tab')}
        </Label>
      }
      <DialogFooter
        styles={{
          actionsRight: { bottom: 0, justifyContent: 'start' }
        }}>
        <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
          {translateMessage('Download postman collection')}
        </PrimaryButton>

        <DefaultButton
          onClick={
            () => props.closePopup()
          }>
          {translateMessage('Close')}
        </DefaultButton>
      </DialogFooter>
    </>
  )
}

export default PathsReview;