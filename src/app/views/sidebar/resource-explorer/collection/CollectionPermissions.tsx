import { DefaultButton, DetailsList, DialogFooter, IGroup, Label, PrimaryButton, SelectionMode } from '@fluentui/react';
import { FC, useEffect } from 'react';

import { useAppSelector } from '../../../../../store';
import { componentNames } from '../../../../../telemetry';
import { CollectionPermission } from '../../../../../types/resources';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { generateGroupsFromList } from '../../../../utils/generate-groups';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';

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