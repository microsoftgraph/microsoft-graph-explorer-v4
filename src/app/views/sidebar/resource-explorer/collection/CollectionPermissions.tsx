import { DefaultButton, DetailsList, DialogFooter, Label, PrimaryButton, SelectionMode } from '@fluentui/react';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '../../../../../store';
import { componentNames } from '../../../../../telemetry';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';

const CollectionPermissions: React.FC<PopupsComponent<null>> = (props) => {
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
    },
    {
      key: 'scopeType', name: translateMessage('Scope Type'), fieldName: 'scopeType', minWidth: 200,
      ariaLabel: translateMessage('Scope Type')
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

  if (!isFetching && permissions.length === 0) {
    return (
      <Label style={{
        display: 'flex',
        width: '100%',
        minHeight: '200px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <FormattedMessage id='permissions not found' />
      </Label>
    )
  }

  if (isFetching) {
    return (
      <Label>
        <FormattedMessage id={'Fetching permissions'} />...
      </Label>
    )
  }

  return (
    <>
      <DetailsList
        items={permissions}
        columns={columns}
        selectionMode={SelectionMode.none}
      />
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