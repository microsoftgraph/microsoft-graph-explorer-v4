import {
  CommandBar,
  DefaultButton,
  DialogFooter, ICommandBarItemProps,
  IContextualMenuProps,
  Label,
  PrimaryButton, SearchBox
} from '@fluentui/react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/actions/collections-action-creators';
import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';
import { UploadPostmanCollection } from './UploadCollection';

const PathsReview = () => {
  const dispatch: AppDispatch = useDispatch();
  const { show: showManifestDescription } = usePopups('manifest-description', 'panel')
  const { show: viewPermissions } = usePopups('collection-permissions', 'panel')
  const { collections } = useAppSelector(
    (state) => state
  );
  const items = collections && collections.length > 0 ? collections.find(k => k.isDefault)!.paths : [];
  const [selectedItems, setSelectedItems] = useState<IResourceLink[]>([]);

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 350, isResizable: true }
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
      key: 'upload',
      disabled: selectedItems.length > 0,
      onRender: () => {
        return <UploadPostmanCollection />
      }
    }
  ];

  const farItems: ICommandBarItemProps[] = [
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

  if (items.length === 0) {
    return (
      <Label style={{
        display: 'flex',
        width: '100%',
        minHeight: '200px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <FormattedMessage id='add to collection first' /> / <UploadPostmanCollection />
      </Label>
    )
  }

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'postmanCollection',
        text: translateMessage('Postman collection'),
        onClick: () => generateCollection()
      },
      {
        key: 'apiManifest',
        text: translateMessage('API manifest'),
        onClick: () => showManifestDescription({
          settings: {
            title: translateMessage('Download an API manifest')
          }
        })
      }
    ]
  };

  return (
    <section style={{ marginTop: '8px' }}>
      <SearchBox
        placeholder={translateMessage('Search')}
      />
      <hr />
      <CommandBar
        items={options}
        farItems={farItems}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
      />
      {items && items.length > 0 && <div style={{ height: '69vh' }}>
        <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
        />
      </div>
      }
      <DialogFooter
        styles={{
          actionsRight: { bottom: 0, justifyContent: 'start' }
        }}>
        <PrimaryButton
          text={translateMessage('Download')}
          menuProps={menuProps}
          allowDisabledFocus
        />
        <DefaultButton onClick={() => viewPermissions({
          settings: {
            title: translateMessage('Required Permissions')
          }
        })} disabled={selectedItems.length > 0}>
          <FormattedMessage id='View permissions' />
        </DefaultButton>
      </DialogFooter>
    </section>
  )
}

export default PathsReview;