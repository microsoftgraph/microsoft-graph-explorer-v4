import { makeStyles, tokens } from '@fluentui/react-components';

const pathStyles = makeStyles({
  drawerBody: {
    padding: 0,
    marginInlineStart: tokens.spacingHorizontalL,
    height: '80vh'
  },
  table: {
    tableLayout: 'auto',
    width: '100%',
    overflow: 'auto',
    borderCollapse: 'collapse'
  },
  row: {
    borderBottom: 'none'
  },
  checkbox: {
    width: '10px'
  },
  scopeLabel: {
    backgroundColor: tokens.colorNeutralForeground3,
    color: tokens.colorNeutralBackground1,
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
  },
  rowFocused: {
    backgroundColor: tokens.colorNeutralBackground4
  }
});

export default pathStyles;
