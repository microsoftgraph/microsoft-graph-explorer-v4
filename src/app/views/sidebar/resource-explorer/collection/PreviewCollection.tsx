import {
  CommandBar, DefaultButton, DialogFooter, ICommandBarItemProps, Label, PrimaryButton
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/actions/collections-action-creators';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generateAPIManifest } from './api-manifest.util';
import { generatePostmanCollection } from './postman.util';

export interface IPathsReview {
  version: string;
}

const PathsReview: React.FC<PopupsComponent<IPathsReview>> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const { collections } = useAppSelector(
    (state) => state
  );
  const items = collections ? collections.find(k => k.isDefault)!.paths : [];
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

  const generateManifest = () => {
    const manifest = generateAPIManifest(items);
    const filename = `${manifest.publisher.name}-API-Manifest.json`;
    downloadToLocal(manifest, filename);
    trackDownload(filename, componentNames.DOWNLOAD_API_MANIFEST_BUTTON);
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
      text: translateMessage('remove'),
      iconProps: { iconName: 'Delete' },
      disabled: selectedItems.length === 0,
      onClick: () => removeSelectedItems()
    }
  ];

  const selectItems = (content: IResourceLink[]) => {
    setSelectedItems(content);
  };

  useEffect(() => {
    if (items.length === 0) {
      props.closePopup();
    }
  }, [items]);

  return (
    <>
      <Label>
        <FormattedMessage id='Export list as a Postman collection message' />
      </Label>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
      />
      {items && items.length > 0 && <>
        <Paths
          resources={items}
          columns={columns}
          selectItems={selectItems}
        />
        <DialogFooter styles={{ actionsRight: { justifyContent: 'start' } }}>
          <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
            <FormattedMessage id='Download postman collection' />
          </PrimaryButton>
          <DefaultButton onClick={generateManifest} disabled={selectedItems.length > 0}>
            <FormattedMessage id='Generate API client' />
          </DefaultButton>
        </DialogFooter>
      </>
      }
    </>
  )
}

export default PathsReview;