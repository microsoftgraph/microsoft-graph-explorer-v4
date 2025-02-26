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
  tree: {
    height: 'calc(100vh - 374px)',
    overflowY: 'auto',
    padding: '5px'
  },
  itemLayout: {
    paddingLeft: tokens.spacingHorizontalXXL
  },
  focusableLink: {
    '&:focus, &:focus-visible': {
      outline: '2px solid !important',
      outlineOffset: '2px !important',
    },
  },
});