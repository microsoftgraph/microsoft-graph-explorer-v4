import { makeResetStyles, tokens, makeStyles } from '@fluentui/react-components';

export const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

export const useLayoutResizeStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '23%'
});

export const useLayoutStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    padding: tokens.spacingHorizontalS
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    minWidth: 0
  },
  sidebar: {
    flex: '0 0 auto',
    flexBasis: `clamp(40px, var(${SIDEBAR_SIZE_CSS_VAR}), 25vw)`,
    maxWidth: '25vw',
    minWidth: '40px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'flex-basis 0.2s ease-in-out',

    '@media (max-width: 768px)': {
      flexBasis: '100vw',
      maxWidth: '100vw',
      minWidth: '100vw',
      position: 'absolute',
      left: 0,
      zIndex: 1000,
      backgroundColor: 'white'
    }
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
    minHeight: 0
  },
  requestResponseArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  requestArea: {
    flex: 1,
    minHeight: '200px',
    overflow: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  responseArea: {
    flex: 1,
    overflow: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  headerMessaging: {
    margin: '10px'
  }
});