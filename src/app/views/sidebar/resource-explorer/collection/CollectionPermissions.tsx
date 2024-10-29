import { DefaultButton,
  DetailsList,
  DialogFooter,
  IGroup,
  Label,
  Link,
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
    (state) => state
  );
  const paths = collections ? collections.find(k => k.isDefault)!.paths : [];

  const columns = [
    {
      key: 'value', name: translateMessage('Value'), fieldName: 'value',
      minWidth: 300,
      ariaLabel: translateMessage('Value')
    }
  ];

  function downloadPermissions(): void {
    const filename = 'collection-permissions.json';
    downloadToLocal(permissions, filename);
    trackDownload(filename, componentNames.DOWNLOAD_COLLECTION_PERMISSIONS_BUTTON);
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
    groups = generateGroupsFromList(permissionsArray, 'scopeType')
  }

  return (
    <>
    <Label style={{ padding: '12px 0px' }}>
        {translateMessage('list of permissions')}
        <Link
          target='_blank'
          rel="noopener noreferrer"
          onClick={(e) => telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
            componentNames.MICROSOFT_GRAPH_API_REFERENCE_DOCS_LINK)}
          href={`https://learn.microsoft.com/${geLocale}/graph/api/overview?view=graph-rest-1.0`}
          underline
        >
          {translateMessage('Microsoft Graph API Reference docs')}
        </Link>
    </Label>
      <DetailsList
        items={permissionsArray}
        columns={columns}
        groups={groups}
        selectionMode={SelectionMode.none}
      />
      {permissions &&
        <DialogFooter styles={{ actionsRight: { justifyContent: 'start' } }}>
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