import { makeStyles } from '@fluentui/react-components'
export const useHistoryStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column'
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