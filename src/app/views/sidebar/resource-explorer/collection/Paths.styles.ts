import { makeStyles } from '@fluentui/react-components';

const pathStyles = makeStyles({
  table: {
    tableLayout: 'auto',
    width: '100%',
    borderCollapse: 'collapse'
  },
  row: {
    borderBottom: '1px solid var(--colorNeutralStroke1)'
  },
  scopeLabel: {
    backgroundColor: 'var(--colorNeutralForeground3)',
    color: 'var(--colorNeutralBackground1)',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    display: 'inline-block',
    textAlign: 'center',
    width: '100%'
  },
  badge: {
    maxWidth: '50%',
    marginInlineEnd: '10px'
  },
  urlMethod: {
    fontWeight: 'bold',
    display: 'inline-block',
    minWidth: '55px',
    textTransform: 'uppercase'
  },
  tableHeader: {
    fontWeight: 'bold'
  }
});

export default pathStyles;
