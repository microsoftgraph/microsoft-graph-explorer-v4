import { IColumn, IIconProps, IconButton, getTheme } from '@fluentui/react';

import { componentNames, telemetry } from '../../../../../telemetry';
import { ADMIN_CONSENT_DOC_LINK, CONSENT_TYPE_DOC_LINK } from '../../../../services/graph-constants';
import { translateMessage } from '../../../../utils/translate-messages';
import { styles } from '../../query-input/auto-complete/suffix/suffix.styles';
import { permissionStyles } from './Permission.styles';

type source = 'panel' | 'tab';

interface ColumnProps {
  source: source;
  tokenPresent?: boolean;
  onColumnClicked?: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void;
}

const trackLinkClickedEvent = (link: string, componentName: string) => {
  telemetry.trackLinkClickEvent(link, componentName);
}

const openExternalWebsite = (url: string) => {
  switch (url) {
  case 'Consent type':
    window.open(CONSENT_TYPE_DOC_LINK, '_blank');
    trackLinkClickedEvent(CONSENT_TYPE_DOC_LINK, componentNames.CONSENT_TYPE_DOC_LINK)
    break;
  case 'Admin consent required':
    window.open(ADMIN_CONSENT_DOC_LINK, '_blank');
    trackLinkClickedEvent(ADMIN_CONSENT_DOC_LINK, componentNames.ADMIN_CONSENT_DOC_LINK);
    break;
  }
}

const getColumns = ({ source, tokenPresent, onColumnClicked }: ColumnProps): IColumn[] => {

  const theme = getTheme();
  const { columnCellStyles, cellTitleStyles } = permissionStyles(theme);

  const infoIcon: IIconProps = {
    iconName: 'Info',
    styles: cellTitleStyles
  };

  const renderColumnHeader = (headerText: string) => {
    if (headerText === 'Status') {
      return (
        <span style={{ position: 'relative', top: '2px', left: '2px', flex: 1 }}>
          {translateMessage('Status')}
        </span>
      )
    }

    return (<div style={{ textAlign: 'left', display: 'flex' }}>
      <IconButton
        iconProps={infoIcon}
        className={styles.iconButton}
        id={'buttonId'}
        ariaLabel={translateMessage(headerText)}
        onClick={() => openExternalWebsite(headerText)}
        styles={{ root: { position: 'relative', left: '4px' } }}
      >
      </IconButton>
      <span style={{ paddingTop: '4px' }}>
        {translateMessage(headerText)}
      </span>
    </div>)
  }

  const columns: IColumn[] = [
    {
      key: 'value',
      name: translateMessage('Permission'),
      fieldName: 'value',
      minWidth: 110,
      maxWidth: 200,
      columnActionsMode: 0,
      isResizable: true
    }
  ];

  if (source === 'tab') {
    columns.push(
      {
        key: 'consentDescription',
        name: translateMessage('Description'),
        fieldName: 'consentDescription',
        minWidth: 300,
        isMultiline: true,
        columnActionsMode: 0,
        targetWidthProportion: 1,
        flexGrow: 1,
        isResizable: true
      }
    );
  }

  columns.push(
    {
      key: 'isAdmin',
      name: translateMessage('Admin consent required'),
      fieldName: 'isAdmin',
      minWidth: 187,
      ariaLabel: translateMessage('Administrator permission'),
      isMultiline: true,
      headerClassName: 'permissionHeader',
      styles: columnCellStyles,
      onRenderHeader: () => renderColumnHeader('Admin consent required'),
      targetWidthProportion: 1,
      flexGrow: 1
    }
  );

  if (tokenPresent) {
    columns.push(
      {
        key: 'consented',
        name: translateMessage('Status'),
        isResizable: false,
        fieldName: 'consented',
        minWidth: 130,
        onRenderHeader: () => renderColumnHeader('Status'),
        styles: columnCellStyles,
        targetWidthProportion: 1,
        flexGrow: 1
      },
      {
        key: 'consentType',
        name: translateMessage('Consent type'),
        isResizable: false,
        fieldName: 'consentType',
        minWidth: 130,
        onRenderHeader: () => renderColumnHeader('Consent type'),
        styles: columnCellStyles,
        ariaLabel: translateMessage('Permission consent type'),
        targetWidthProportion: 1,
        flexGrow: 1
      }
    );
  }
  return columns;
}

export { getColumns };

