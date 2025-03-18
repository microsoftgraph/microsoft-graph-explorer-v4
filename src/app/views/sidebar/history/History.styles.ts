import { makeStyles } from '@fluentui/react-components'
export const useHistoryStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '8px'
  },
  tree: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '5px',
    maxHeight: 'calc(100vh - 100px)'
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  titleAside: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
  },
  badgeContainer: {
    minWidth: '50px',
    display: 'inline-flex'
  },
  badge: {
    maxWidth: '50px'
  }
})