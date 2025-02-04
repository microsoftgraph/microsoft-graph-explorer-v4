import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Label,
  Link,
  makeStyles,
  Spinner,
  MessageBar,
  MessageBarBody
} from '@fluentui/react-components';
import { FC, useEffect } from 'react';
import { useAppSelector } from '../../../../../store';
import { componentNames, telemetry } from '../../../../../telemetry';
import { CollectionPermission } from '../../../../../types/resources';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';
import { geLocale } from '../../../../../appLocale';
import CommonCollectionsPanel from './CommonCollectionsPanel';

const useStyles = makeStyles({
  centeredLabel: {
    display: 'flex',
    width: '100%',
    minHeight: '200px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableContainer: {
    height: '80vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  }
});

const CollectionPermissions: FC<PopupsComponent<null>> = (props) => {
  const { getPermissions, permissions, isFetching } = useCollectionPermissions();
  const { collections } = useAppSelector((state) => state.collections);
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
  };

  const handleTelemetryClick = (
    e: React.MouseEvent<HTMLElement | HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    telemetry.trackLinkClickEvent(
      (e.currentTarget as HTMLAnchorElement).href,
      componentNames.MICROSOFT_GRAPH_PERMISSIONS_REFERENCE_DOCS_LINK
    );
  };

  useEffect(() => {
    if (paths.length > 0) {
      getPermissions(paths)
    }
  }, [paths]);

  const styles = useStyles();

  if (!isFetching && !permissions) {
    return (
      <Label className={styles.centeredLabel}>
        {translateMessage('permissions not found')}
      </Label>
    );
  }

  if (isFetching) {
    return (
      <Spinner label={translateMessage('Fetching permissions')} />
    );
  }

  const permissionsArray: CollectionPermission[] = [];
  if (permissions) {
    Object.keys(permissions).forEach(key => {
      permissionsArray.push(...permissions[key]);
    });
  }

  return (
    <CommonCollectionsPanel
      primaryButtonText='Download permissions'
      primaryButtonAction={downloadPermissions}
      primaryButtonDisabled={!permissions}
      closePopup={props.dismissPopup}
    >
      <MessageBar intent='info'>
        <MessageBarBody>
          {translateMessage('list of permissions')}
          <Link
            target='_blank'
            rel="noopener noreferrer"
            onClick={handleTelemetryClick}
            href={`https://learn.microsoft.com/${geLocale}/graph/permissions-reference?view=graph-rest-1.0`}
          >
            {translateMessage('Microsoft Graph permissions reference')}
          </Link>
        </MessageBarBody>
      </MessageBar>
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell key={column.key}>{column.name}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsArray.map((permission, index) => (
              <TableRow key={index}>
                <TableCell>{permission.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CommonCollectionsPanel>
  );
};

export default CollectionPermissions;