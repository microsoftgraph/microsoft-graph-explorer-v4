import { makeStyles } from '@fluentui/react-components';

const pathStyles = makeStyles({
  table: {
    tableLayout: 'fixed',
    width: '100%',
    overflow: 'auto',
    borderCollapse: 'collapse'
  },
  row: {
    borderBottom: 'none'
  },
  scopeLabel: {
    backgroundColor: 'var(--colorNeutralForeground3)',
    color: 'var(--colorNeutralBackground1)',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    display: 'inline-block',
    textAlign: 'center',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  badge: {
    maxWidth: '50%'
  },
  badgeContainer: {
    display: 'inline-block',
    minWidth: '55px'
  },
  urlAndMethod: {
    display: 'inline-flex',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  tableHeader: {
    fontWeight: 'bold'
  }
});

export default pathStyles;
