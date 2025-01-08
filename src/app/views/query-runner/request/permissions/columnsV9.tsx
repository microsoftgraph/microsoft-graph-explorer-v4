import {
  TableColumnDefinition,
  createTableColumn,
  Tooltip,
  Button,
  makeStyles
} from '@fluentui/react-components';

import { componentNames, telemetry } from '../../../../../telemetry';
import { ADMIN_CONSENT_DOC_LINK, CONSENT_TYPE_DOC_LINK } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { IPermission } from '../../../../../types/permissions';

  type Source = 'panel' | 'tab';

  interface ColumnProps {
    source: Source;
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

const useStyles = makeStyles({
  columnHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  headerIcon: {
    marginLeft: '4px'
  }
});

const getColumns = ({ source, tokenPresent }: ColumnProps): TableColumnDefinition<IPermission>[] => {
  const styles = useStyles();

  const renderColumnHeader = (headerText: string) => (
    <div className={styles.columnHeader}>
      {translateMessage(headerText)}
      <Button
        icon={<Tooltip content={translateMessage(`Learn more about ${headerText}`)} relationship='label'/>}
        appearance="transparent"
        onClick={() => openExternalWebsite(headerText)}
        className={styles.headerIcon}
        aria-label={translateMessage(headerText)}
      />
    </div>
  );

  const columns: TableColumnDefinition<IPermission>[] = [
    createTableColumn({
      columnId: 'value',
      renderHeaderCell: () => translateMessage('Permission'),
      renderCell: (item) => item.value,
      compare: (a, b) => a.value.localeCompare(b.value)
    })
  ];

  if (source === 'tab') {
    columns.push(
      createTableColumn({
        columnId: 'consentDescription',
        renderHeaderCell: () => translateMessage('Description'),
        renderCell: (item) => item.consentDescription
      })
    );
  }

  columns.push(
    createTableColumn({
      columnId: 'isAdmin',
      renderHeaderCell: () => renderColumnHeader('Admin consent required'),
      renderCell: (item) => (item.isAdmin ? translateMessage('Yes') : translateMessage('No'))
    })
  );

  if (tokenPresent) {
    columns.push(
      createTableColumn({
        columnId: 'consented',
        renderHeaderCell: () => renderColumnHeader('Status'),
        renderCell: (item) => (item.consented ? translateMessage('Granted') : translateMessage('Not Granted'))
      }),
      createTableColumn({
        columnId: 'consentType',
        renderHeaderCell: () => renderColumnHeader('Consent type'),
        renderCell: (item) => item.consentType
      })
    );
  }

  return columns;
};

export { getColumns };