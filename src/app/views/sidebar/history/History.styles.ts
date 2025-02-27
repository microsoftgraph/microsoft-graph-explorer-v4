import { makeStyles } from '@fluentui/react-components'
export const useHistoryStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  tree: {
    height: 'calc(100vh - 374px)',
    overflowY: 'auto',
    padding: '5px'
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
    ':hover, :focus': {
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
  }
})