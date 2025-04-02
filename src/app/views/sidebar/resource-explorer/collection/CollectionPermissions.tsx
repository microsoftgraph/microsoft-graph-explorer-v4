import React, { FC, useEffect, useState } from 'react';
import {
  CounterBadge,
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  TreeOpenChangeEvent,
  TreeOpenChangeData,
  TreeItemValue,
  Label,
  Spinner,
  Link,
  makeStyles,
  MessageBar,
  MessageBarBody,
  tokens
} from '@fluentui/react-components';
import { useAppSelector } from '../../../../../store';
import { componentNames, telemetry } from '../../../../../telemetry';
import { CollectionPermission } from '../../../../../types/resources';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { translateMessage } from '../../../../utils/translate-messages';
import { downloadToLocal, trackDownload } from '../../../common/download';
import CommonCollectionsPanel from './CommonCollectionsPanel';
import { formatScopeLabel } from './collection.util';
import { PERMS_SCOPE } from '../../../../services/graph-constants';

const useStyles = makeStyles({
  centeredLabel: {
    display: 'flex',
    width: '100%',
    minHeight: '200px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  treeContainer: {
    height: '80vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    marginBlockStart: tokens.spacingVerticalL
  }
});

const CollectionPermissions: FC<PopupsComponent<null>> = (props) => {
  const { getPermissions, permissions, isFetching } = useCollectionPermissions();
  const { collections } = useAppSelector((state) => state.collections);
  const defaultCollection = collections ? collections.find(k => k.isDefault) : null;
  const paths = defaultCollection ? defaultCollection.paths : [];

  const styles = useStyles();

  const [openItems, setOpenItems] = useState<Set<TreeItemValue>>(new Set());

  useEffect(() => {
    if (paths.length > 0) {
      getPermissions(paths);
    }
  }, [paths, getPermissions]);

  const downloadPermissions = (): void => {
    const filename = 'collection-permissions.json';
    if (permissions) {
      downloadToLocal(permissions, filename);
      trackDownload(filename, componentNames.DOWNLOAD_COLLECTION_PERMISSIONS_BUTTON);
    }
  };

  const handleTelemetryClick = (
    e: React.MouseEvent<HTMLElement | HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    telemetry.trackLinkClickEvent(
      (e.currentTarget as HTMLAnchorElement).href,
      componentNames.MICROSOFT_GRAPH_PERMISSIONS_REFERENCE_DOCS_LINK
    );
  };

  const permissionsArray: CollectionPermission[] = [];
  if (permissions) {
    Object.keys(permissions).forEach((key) => {
      permissionsArray.push(...permissions[key]);
    });
  }

  const groupedPermissions = new Map<string, CollectionPermission[]>();
  permissionsArray.forEach((p) => {
    const groupKey = p.scopeType || 'unknown';
    if (!groupedPermissions.has(groupKey)) {
      groupedPermissions.set(groupKey, []);
    }
    groupedPermissions.get(groupKey)?.push(p);
  });

  const handleOpenChange = (_event: TreeOpenChangeEvent, data_: TreeOpenChangeData) => {
    setOpenItems(data_.openItems);
  };

  if (!isFetching && !permissions) {
    return (
      <Label className={styles.centeredLabel}>
        {translateMessage('permissions not found')}
      </Label>
    );
  }

  if (isFetching) {
    return <Spinner label={translateMessage('Fetching permissions')} />;
  }

  return (
    <CommonCollectionsPanel
      primaryButtonText="Download permissions"
      primaryButtonAction={downloadPermissions}
      primaryButtonDisabled={!permissions}
      closePopup={props.dismissPopup}
    >
      <MessageBar intent="info">
        <MessageBarBody>
          {translateMessage('list of permissions')}{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTelemetryClick}
            href="https://learn.microsoft.com/graph/permissions-reference?view=graph-rest-1.0"
          >
            {translateMessage('Microsoft Graph permissions reference')}
          </Link>
        </MessageBarBody>
      </MessageBar>

      <div className={styles.treeContainer}>
        <FlatTree
          openItems={openItems}
          onOpenChange={handleOpenChange}
          aria-label={translateMessage('Permissions')}
        >
          {[...groupedPermissions.entries()].map(([scopeType, perms]) => (
            <React.Fragment key={scopeType}>
              <FlatTreeItem value={scopeType ?? ''} itemType="branch" aria-level={1}
                aria-setsize={perms.length}
                aria-posinset={perms.length + 1}>
                <TreeItemLayout aside={
                  <CounterBadge count={perms.length} color="informative" />
                }>{formatScopeLabel(scopeType as PERMS_SCOPE)}</TreeItemLayout>
              </FlatTreeItem>
              {openItems.has(scopeType) &&
              perms.map((permission) => {
                return (
                  <React.Fragment key={permission.value}>
                    <FlatTreeItem
                      key={permission.value}
                      value={permission.value}
                      parentValue={scopeType ?? ''}
                      itemType="leaf"
                      aria-level={2}
                      aria-posinset={perms.findIndex((p) => p.value === permission.value) + 1}
                      aria-setsize={perms.length}
                    >
                      <TreeItemLayout>{permission.value}</TreeItemLayout>
                    </FlatTreeItem>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </FlatTree>
      </div>
    </CommonCollectionsPanel>
  );
};

export default CollectionPermissions;
