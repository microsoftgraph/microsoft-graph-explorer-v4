import { DefaultButton, DetailsList, DialogFooter, Label, PrimaryButton, SelectionMode } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '../../../../../store';
import { componentNames } from '../../../../../telemetry';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';
import { getCollectionPermissions } from './collection-permissions.util';

interface CollectionPermission {
  value: string;
  scopeType: string;
  consentDisplayName: string;
  consentDescription: string;
  isAdmin: boolean;
  isLeastPrivilege: boolean;
  isHidden: boolean;
}

const CollectionPermissions: React.FC<PopupsComponent<null>> = (props) => {
  const [permissions, setPermissions] = useState<CollectionPermission[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const { collections } = useAppSelector(
    (state) => state
  );
  const paths = collections ? collections.find(k => k.isDefault)!.paths : [];

  const columns = [
    {
      key: 'value', name: translateMessage('Value'), fieldName: 'value',
      minWidth: 300,
      ariaLabel: translateMessage('Value')
    },
    {
      key: 'scopeType', name: translateMessage('Scope Type'), fieldName: 'scopeType', minWidth: 200,
      ariaLabel: translateMessage('Scope Type')
    }
  ];

  async function getPermissions() {
    setIsFetching(true);
    try {
      const perms = await getCollectionPermissions(paths);
      setIsFetching(false);
      setPermissions(perms.results);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (paths && paths.length > 0) {
      getPermissions();
    }
  }, [paths]);

  if (!isFetching && permissions.length === 0) {
    <Label style={{
      display: 'flex',
      width: '100%',
      minHeight: '200px',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <FormattedMessage id='permissions not found' />
    </Label>
  }

  function downloadPermissions(): void {
    const filename = 'collection-permissions.json';
    downloadToLocal(permissions, filename);
    trackDownload(filename, componentNames.DOWNLOAD_COLLECTION_PERMISSIONS_BUTTON);
  }

  return (
    <>
      {isFetching ? <Label>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label> :
        <DetailsList
          items={permissions}
          columns={columns}
          selectionMode={SelectionMode.none}
        />
      }
      {permissions.length > 0 &&
        <DialogFooter styles={{ actionsRight: { justifyContent: 'start' } }}>
          <PrimaryButton onClick={downloadPermissions}>
            <FormattedMessage id='Download' />
          </PrimaryButton>
          <DefaultButton onClick={() => props.dismissPopup()}>
            <FormattedMessage id='Close' />
          </DefaultButton>
        </DialogFooter>}
    </>
  )
}

export default CollectionPermissions