import { makeStyles, tokens } from '@fluentui/react-components';

const permissionStyles = makeStyles({
  root: {
    padding: '17px'
  },
  label: {
    marginLeft: '12px'
  },
  errorLabel: {
    marginTop: '10px',
    paddingLeft: '10px',
    paddingRight: '20px',
    minHeight: '200px'
  },
  permissionText: {
    marginBottom: '5px',
    paddingLeft: '10px'
  },
  tableWrapper: {
    flex: 1,
    overflowY: 'auto',
    height: '17rem'
  },
  adminLabel: {
    fontSize: tokens.fontSizeBase300,
    padding: tokens.spacingVerticalXS
  },
  button: {
    margin: tokens.spacingVerticalXXS
  },
  tooltip: {
    display: 'block'
  },
  icon: {
    position: 'relative',
    top: '4px',
    cursor: 'pointer'
  },
  iconButton: {
    position: 'relative',
    left: '4px',
    top: '2px'
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left'
  },
  headerText: {
    marginLeft: '8px'
  },
  permissionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem'
  },
  controlsRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  searchBar: {
    width: '100%'
  }
});

export default permissionStyles;
