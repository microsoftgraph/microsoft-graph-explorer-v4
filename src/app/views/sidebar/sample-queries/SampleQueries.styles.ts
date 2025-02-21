import { makeStyles, tokens } from '@fluentui/react-components';
export const useStyles = makeStyles({
  container: {
    marginTop: '6px'
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  iconBefore: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '50px',
    paddingRight: '0'
  },
  badge: {
    maxWidth: '50px'
  },
  disabled: {
    backgroundColor: tokens.colorSubtleBackgroundHover,
    '&:hover': {
      cursor: 'not-allowed'
    }
  },
  sampleQueries: {
    height: 'calc(100vh - 374px)',
    overflowY: 'auto'
  },
  itemLayout: {
    paddingLeft: tokens.spacingHorizontalXXL
  }
});