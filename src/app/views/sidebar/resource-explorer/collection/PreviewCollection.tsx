import {
  CommandBar,
  DialogFooter, ICommandBarItemProps,
  IContextualMenuProps,
  Label, PrimaryButton
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { AppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { IResourceLink } from '../../../../../types/resources';
import { removeResourcePaths } from '../../../../services/actions/collections-action-creators';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection } from './postman.util';
import { PERMS_SCOPE } from '../../../../services/graph-constants';

export interface IPathsReview {
  version: string;
}

const PathsReview: React.FC<PopupsComponent<IPathsReview>> = (props) => {
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
      key: 'remove',
      text: translateMessage('remove'),
      iconProps: { iconName: 'Delete' },
      disabled: selectedItems.length === 0,
      onClick: () => removeSelectedItems()
    }
  ];

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: PERMS_SCOPE.WORK,
        text: 'Use delegated permissions',
        iconProps: { iconName: 'Permissions' },
        onClick: () => createManifest(PERMS_SCOPE.WORK)
      },
      {
        key: PERMS_SCOPE.APPLICATION,
        text: 'Use application permissions',
        iconProps: { iconName: 'Permissions' },
        onClick: () => createManifest(PERMS_SCOPE.APPLICATION)
      },
      {
        key: `${PERMS_SCOPE.APPLICATION}_${PERMS_SCOPE.WORK}`,
        text: 'Use both permissions',
        iconProps: { iconName: 'Permissions' },
        onClick: () => createManifest(`${PERMS_SCOPE.APPLICATION}_${PERMS_SCOPE.WORK}`)
      }
    ]
  };

  const selectItems = (content: IResourceLink[]) => {
    setSelectedItems(content);
  };

  const createManifest = (chosenItem?: string) => {
    showManifestDescription({
      settings: {
        title: translateMessage('Download an API manifest')
      },
      data: {
        selectedScopeType: chosenItem ?? `${PERMS_SCOPE.APPLICATION}_${PERMS_SCOPE.WORK}`
      }
    });
  }

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
      {items && items.length > 0 && <div style={{ height: '81vh' }}>
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
        <PrimaryButton onClick={generateCollection} disabled={selectedItems.length > 0}>
          <FormattedMessage id='Download postman collection' />
        </PrimaryButton>
        <PrimaryButton
          onClick={() => createManifest()}
          disabled={selectedItems.length > 0}
          split={true}
          splitButtonAriaLabel='Select scopeType'
          menuProps={menuProps}
        >
          <FormattedMessage id='Create API manifest' />
        </PrimaryButton>
        <PrimaryButton onClick={() => viewPermissions({
          settings: {
            title: translateMessage('Required Permissions')
          }
        })} disabled={selectedItems.length > 0}>
          <FormattedMessage id='View permissions' />
        </PrimaryButton>
      </DialogFooter>
    </>
  )
}

export default PathsReview;