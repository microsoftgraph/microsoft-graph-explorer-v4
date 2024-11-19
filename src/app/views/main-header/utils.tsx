import { makeStyles } from '@fluentui/react-components';

export const useHeaderStyles = makeStyles({
  iconButton: {
    height: '100%',
    minWidth: '48px',
    maxWidth: '48px'
  },
  tenantButton: {
    height: '100%',
    cursor: 'default !important',
    '@media (max-width: 600px)': {
      display: 'none'
    }
  }
})