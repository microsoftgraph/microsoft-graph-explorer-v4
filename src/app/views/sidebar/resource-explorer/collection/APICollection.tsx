import {
  Label,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Button
} from '@fluentui/react-components';
import { Edit20Regular, Key20Regular, ArrowUpload20Regular, List20Regular } from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { usePopups } from '../../../../services/hooks';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';
import Paths from './Paths';
import { generatePostmanCollection, generateResourcePathsFromPostmanCollection } from './postman.util';
import { addResourcePaths, removeResourcePaths } from '../../../../services/slices/collections.slice';
import { useEffect, useState } from 'react';
import { ResourcePath } from '../../../../../types/resources';
import { setQueryResponseStatus } from '../../../../services/slices/query-status.slice';
import { isGeneratedCollectionInCollection } from './upload-collection.util';
import CommonCollectionsPanel from './CommonCollectionsPanel';

export interface APICollection {
  version: string;
}

const APICollection: React.FC<PopupsComponent<APICollection>> = (props) => {
  const dispatch = useAppDispatch();
  const { show: viewPermissions } = usePopups('collection-permissions', 'panel');
  const { show: showPopup } = usePopups('edit-collection-panel', 'panel');
  const { show: showEditScopePanel } = usePopups('edit-scope-panel', 'panel');
  const { collections } = useAppSelector((state) => state.collections);
  const [isDialogHidden, setIsDialogHidden] = useState(true);
  const [uploadedCollections, setUploadedCollections] = useState<ResourcePath[]>([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [items, setItems] = useState<ResourcePath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (collections && collections.length > 0) {
        const defaultPaths = collections.find(k => k.isDefault)?.paths || [];
        setItems(defaultPaths);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [collections]);

  if (loading) {
    return <Label>{translateMessage('Loading collections...')}</Label>;
  }

  const columns = [
    { key: 'url', name: 'URL', fieldName: 'url', minWidth: 300, maxWidth: 1100, isResizable: true },
    { key: 'scope', name: 'Scope', fieldName: 'scope', minWidth: 150, maxWidth: 200, isResizable: true }
  ];

  const generateCollection = () => {
    const content = generatePostmanCollection(items);
    const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
    downloadToLocal(content, filename);
    trackDownload(filename, componentNames.DOWNLOAD_POSTMAN_COLLECTION_BUTTON);
  }

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target!.result!;
        try {
          const jsonData = JSON.parse(fileContent as string);
          const generatedCollection = generateResourcePathsFromPostmanCollection(jsonData);
          if (collections && collections.length > 0 && collections.find(k => k.isDefault)!.paths.length > 0) {
            const currentCollection = collections.find(k => k.isDefault)!.paths;
            if (isGeneratedCollectionInCollection(currentCollection, generatedCollection)) {
              trackUploadAction('Collection exists');
              dispatchCollectionSelectionStatus('Collection items exist', 'Collection items exist');
            }
            else {
              setUploadedCollections(generatedCollection);
              toggleIsDialogHidden();
            }
          }
          else {
            trackUploadAction('Collection added')
            dispatch(addResourcePaths(generatedCollection));
            setItems(generatedCollection);
          }
        }
        catch (error) {
          trackUploadAction('Invalid file format');
          dispatchCollectionSelectionStatus('Invalid file format', 'Invalid file format');
          dispatch(
            setQueryResponseStatus({
              status: translateMessage('Invalid file format'),
              statusText: translateMessage('Invalid file format'),
              ok: false,
              messageBarType: 'error'
            })
          )
        }
      };
      reader.readAsText(file);
      setFileInputKey(Date.now());
    }
  }

  const dispatchCollectionSelectionStatus = (status: string, statusMessage: string) => {
    dispatch(
      setQueryResponseStatus({
        status: translateMessage(status),
        statusText: translateMessage(statusMessage),
        ok: false,
        messageBarType: 'error'
      })
    )
  }

  const trackUploadAction = (status: string) => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      componentName: componentNames.UPLOAD_COLLECTIONS_BUTTON,
      status
    });
  }

  const toggleIsDialogHidden = () => {
    setIsDialogHidden(!isDialogHidden);
  }
  const mergeWithExistingCollection = () => {
    trackUploadAction('Collection merged');
    dispatch(addResourcePaths(uploadedCollections));
    setIsDialogHidden(!isDialogHidden);
  }
  const overwriteCollection = () => {
    trackUploadAction('Collection replaced');
    const resourcePaths = getPathsFromCollection();
    dispatch(removeResourcePaths(resourcePaths));
    setIsDialogHidden(!isDialogHidden);
    dispatch(addResourcePaths(uploadedCollections));
  }
  const getPathsFromCollection = (): ResourcePath[] => {
    let resourcePaths: ResourcePath[] = [];
    if (collections && collections.length > 0) {
      const paths = collections.find(k => k.isDefault)!.paths;
      resourcePaths = paths as ResourcePath[];
    }
    return resourcePaths;
  }

  const openEditCollectionPanel = () => {
    showPopup({
      settings: {
        title: translateMessage('Edit Collection'),
        width: 'lg'
      }
    });
  };

  const openEditScopePanel = () => {
    showEditScopePanel({
      settings: {
        title: translateMessage('Edit Scope'),
        width: 'lg'
      }
    });
  };

  const options = [
    {
      key: 'remove',
      text: translateMessage('Edit collection'),
      icon: <Edit20Regular />,
      disabled: items.length === 0,
      onClick: openEditCollectionPanel
    },
    {
      key: 'set-scope',
      text: translateMessage('Edit scope'),
      icon: <Key20Regular />,
      disabled: items.length === 0,
      onClick: openEditScopePanel
    },
    {
      key: 'upload',
      text: translateMessage('Upload a new list'),
      icon: <ArrowUpload20Regular />,
      onClick: () => document.getElementById('file-input')?.click()
    }
  ];

  const farItems = [
    {
      key: 'preview-permissions',
      text: translateMessage('Preview permissions'),
      icon: <List20Regular />,
      disabled: items.length === 0,
      onClick: () => viewPermissions({
        settings: {
          title: translateMessage('Preview Permissions'),
          width: 'lg'
        }
      })}
  ];

  return (
    <CommonCollectionsPanel
      primaryButtonText='Download postman collection'
      primaryButtonAction={generateCollection}
      primaryButtonDisabled={items.length === 0}
      closePopup={props.dismissPopup}
    >
      <Toolbar aria-label='Selection actions' style={{ justifyContent: 'space-between' }}>
        <ToolbarGroup>
          {options.map(option => (
            <ToolbarButton
              key={option.key}
              icon={option.icon}
              disabled={option.disabled}
              onClick={option.onClick}
              style={{ marginInlineEnd: '30px' }}
            >
              {option.text}
            </ToolbarButton>
          ))}
        </ToolbarGroup>
        <ToolbarGroup>
          {farItems.map(item => (
            <ToolbarButton
              key={item.key}
              icon={item.icon}
              disabled={item.disabled}
              onClick={item.onClick}
            >
              {item.text}
            </ToolbarButton>
          ))}
        </ToolbarGroup>
      </Toolbar>

      <input
        key={fileInputKey}
        type="file"
        id="file-input"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {items && items.length > 0 ?
        (<div>
          <Paths
            resources={items}
            columns={columns}
          />
        </div>
        ) :
        (
          <Label style={{
            height: '80vh',
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {translateMessage('Add queries in the API Explorer and History tab')}
          </Label>
        )}

      <Dialog open={!isDialogHidden} onOpenChange={toggleIsDialogHidden}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{translateMessage('Upload collection')}</DialogTitle>
            <DialogContent>
              {translateMessage('You have an existing collection. Would you like to merge or replace it?')}
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={mergeWithExistingCollection}>
                {translateMessage('Merge with existing')}
              </Button>
              <Button onClick={overwriteCollection}>
                {translateMessage('Replace existing')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </CommonCollectionsPanel>
  )
}

export default APICollection;