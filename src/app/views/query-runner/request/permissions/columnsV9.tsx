import {
  createTableColumn,
  TableColumnDefinition,
  Tooltip,
  Button
} from '@fluentui/react-components';
import { telemetry, componentNames } from '../../../../../telemetry';
import { ADMIN_CONSENT_DOC_LINK, CONSENT_TYPE_DOC_LINK } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { IPermission } from '../../../../../types/permissions';
import { InfoRegular } from '@fluentui/react-icons';
import PermissionItem from './PermissionItemV9';
import permissionStyles from './Permission.stylesV9';

type source = 'panel' | 'tab';

interface ColumnProps {
  source: source;
  tokenPresent?: boolean;
}

const trackLinkClickedEvent = (link: string, componentName: string) => {
  telemetry.trackLinkClickEvent(link, componentName);
};

const openExternalWebsite = (url: string) => {
  switch (url) {
  case 'Consent type':
    window.open(CONSENT_TYPE_DOC_LINK, '_blank');
    trackLinkClickedEvent(CONSENT_TYPE_DOC_LINK, componentNames.CONSENT_TYPE_DOC_LINK);
    break;
  case 'Admin consent required':
    window.open(ADMIN_CONSENT_DOC_LINK, '_blank');
    trackLinkClickedEvent(ADMIN_CONSENT_DOC_LINK, componentNames.ADMIN_CONSENT_DOC_LINK);
    break;
  }
};

const createRenderColumnHeader = (styles: ReturnType<typeof permissionStyles>) => {
  const RenderColumnHeader = (headerText: string): JSX.Element => {
    const tooltipMessage =
    headerText === 'Admin consent required'
      ? translateMessage('Administrator permission')
      : translateMessage('Permission consent type');
    return (
      <div className={styles.headerContainer}>
        <Tooltip
          content={tooltipMessage}
          relationship='label'>
          <Button
            icon={<InfoRegular />}
            appearance="subtle"
            size="small"
            className={styles.iconButton}
            aria-label={translateMessage(headerText)}
            onClick={() => openExternalWebsite(headerText)}
          />
        </Tooltip>
        <span className={styles.headerText}>{translateMessage(headerText)}</span>
      </div>
    );
  };
  RenderColumnHeader.displayName = 'RenderColumnHeader';
  return RenderColumnHeader;
};

const getColumns = ({ source, tokenPresent }: ColumnProps):
 TableColumnDefinition<{item: IPermission; index: number }>[] => {
  const styles = permissionStyles();
  const renderColumnHeader = createRenderColumnHeader(styles);
  const columns: TableColumnDefinition<{ item: IPermission; index: number }>[] = [
    createTableColumn({
      columnId: 'value',
      renderHeaderCell: () => translateMessage('Permission'),
      renderCell: ({ item, index }) => {
        return <PermissionItem column={{ key: 'value', fieldName: 'value' }} index={index} item={item} />;
      }
    })
  ];

  if (source === 'tab') {
    columns.push(
      createTableColumn({
        columnId: 'consentDescription',
        renderHeaderCell: () => translateMessage('Description'),
        renderCell: ({item, index}) => (
          <PermissionItem
            column={{ key: 'consentDescription', fieldName: 'consentDescription' }}
            index={index}
            item={item} />
        )
      })
    );
  }

  columns.push(
    createTableColumn({
      columnId: 'isAdmin',
      renderHeaderCell: () => renderColumnHeader('Admin consent required'),
      renderCell: ({item, index}) => (
        <PermissionItem column={{ key: 'isAdmin', fieldName: 'isAdmin' }} index={index} item={item} />
      )
    })
  );

  if (tokenPresent) {
    columns.push(
      createTableColumn({
        columnId: 'consented',
        renderHeaderCell: () => translateMessage('Status'),
        renderCell: ({item, index}) => (
          <PermissionItem column={{ key: 'consented', fieldName: 'consented' }} index={index} item={item} />
        )
      }),
      createTableColumn({
        columnId: 'consentType',
        renderHeaderCell: () => renderColumnHeader('Consent type'),
        renderCell: ({item, index}) => (
          <PermissionItem column={{ key: 'consentType', fieldName: 'consentType' }} index={index} item={item} />
        )
      })
    );
  }

  return columns;
};

export { getColumns };
