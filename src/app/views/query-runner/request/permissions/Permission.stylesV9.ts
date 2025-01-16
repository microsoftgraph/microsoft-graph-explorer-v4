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
    overflowY: 'auto'
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
    top: '2px',
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
  value: {
    display: 'flex',
    gap: '2px'
  }
});

export default permissionStyles;
