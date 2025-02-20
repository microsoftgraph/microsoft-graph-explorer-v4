import { makeStyles, tokens } from '@fluentui/react-components';

const permissionStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalM
  },
  label: {
    marginLeft: tokens.spacingHorizontalS
  },
  table: {
    tableLayout: 'fixed',
    display: 'table-cell'
  },
  tableHeader: {
    fontWeight: tokens.fontWeightSemibold
  },
  errorLabel: {
    marginTop: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalL,
    minHeight: '200px'
  },
  permissionText: {
    marginBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalS
  },
  tableWrapper: {
    flex: 1,
    overflowY: 'auto',
    height: '17rem'
  },
  adminLabel: {
    fontSize: tokens.fontSizeBase300,
    padding: tokens.spacingVerticalXS,
    textAlign: 'center'
  },
  tooltip: {
    display: 'block'
  },
  icon: {
    display: 'inline'
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left'
  },
  headerText: {
    marginLeft: tokens.spacingHorizontalXS
  },
  permissionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM
  },
  controlsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    alignItems: 'center'
  },
  searchBar: {
    width: '100%'
  }
});

export default permissionStyles;
