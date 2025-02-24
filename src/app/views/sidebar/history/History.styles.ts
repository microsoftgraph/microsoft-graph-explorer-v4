import { makeStyles } from '@fluentui/react-components'
export const useHistoryStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  tree: {
    height: 'calc(100vh - 374px)',
    overflowY: 'auto'
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
  historyAsideIcons: {
    display: 'none'
  },
  historyTreeItemLayout: {
    ':hover': {
      '& [data-history-aside]': {
        display: 'flex'
      }
    }
  },
  badgeContainer: {
    minWidth: '50px',
    display: 'inline-flex'
  },
  badge: {
    maxWidth: '50px'
  },
  text: {
    overflow: 'hidden'
  }
})