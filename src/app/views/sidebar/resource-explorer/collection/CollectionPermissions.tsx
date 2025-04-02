import { DefaultButton,
  DetailsList,
  DialogFooter,
  IGroup,
  Label,
  Link,
  MessageBar,
  PrimaryButton,
  SelectionMode } from '@fluentui/react';
import { FC, useEffect } from 'react';

import { useAppSelector } from '../../../../../store';
import { componentNames, telemetry } from '../../../../../telemetry';
import { CollectionPermission } from '../../../../../types/resources';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';
import { geLocale } from '../../../../../appLocale';

const CollectionPermissions: FC<PopupsComponent<null>> = (props) => {
  const { getPermissions, permissions, isFetching } = useCollectionPermissions();

  const { collections } = useAppSelector(
    (state) => state.collections
  );
  const defaultCollection = collections ? collections.find(k => k.isDefault) : null;
  const paths = defaultCollection ? defaultCollection.paths : [];


  const columns = [
    {
      key: 'value', name: translateMessage('Permissions'), fieldName: 'value',
      minWidth: 300,
      ariaLabel: translateMessage('Value')
    }
  ];

  const downloadPermissions = (): void => {
    const filename = 'collection-permissions.json';
    downloadToLocal(permissions, filename);
    trackDownload(filename, componentNames.DOWNLOAD_COLLECTION_PERMISSIONS_BUTTON);
  }

  const handleTelemetryClick =
  (e: React.MouseEvent<HTMLElement | HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => {
    telemetry.trackLinkClickEvent(
      (e.currentTarget as HTMLAnchorElement).href,
      componentNames.MICROSOFT_GRAPH_PERMISSIONS_REFERENCE_DOCS_LINK
    );
  }

  useEffect(() => {
    if (paths.length > 0) {
      getPermissions(paths)
    }
  }, [paths]);

  if (!isFetching && !permissions) {
    return (
      <Label style={{
        display: 'flex',
        width: '100%',
        minHeight: '200px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {translateMessage('permissions not found')}
      </Label>
    )
  }

  if (isFetching) {
    return (
      <Label>
        {translateMessage('Fetching permissions')}...
      </Label>
    )
  }

  const permissionsArray: CollectionPermission[] = [];
  let groups: IGroup[] | undefined = [];
  if (permissions) {
    Object.keys(permissions).forEach(key => {
      permissionsArray.push(...permissions[key]);
    });
    groups = generateGroupsFromList(permissionsArray, 'scopeType');
  }

  return (
    <>
      <MessageBar isMultiline={true}>
        {translateMessage('list of permissions')}
        <Link
          target='_blank'
          rel="noopener noreferrer"
          onClick={handleTelemetryClick}
          href={`https://learn.microsoft.com/${geLocale}/graph/permissions-reference?view=graph-rest-1.0`}
          underline
        >
          {translateMessage('Microsoft Graph permissions reference')}
        </Link>
      </MessageBar>
      <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <DetailsList
          items={permissionsArray}
          columns={columns}
          groups={groups}
          selectionMode={SelectionMode.none}
        />
      </div>
      {permissions &&
        <DialogFooter styles={{
          actionsRight: { bottom: 0, justifyContent: 'start', position: 'fixed', width: '100%', zIndex: 1  }
        }}>
          <PrimaryButton onClick={downloadPermissions}>
            {translateMessage('Download permissions')}
          </PrimaryButton>
          <DefaultButton onClick={() => props.dismissPopup()}>
            {translateMessage('Close')}
          </DefaultButton>
        </DialogFooter>}
    </>
  )
}

export default CollectionPermissions