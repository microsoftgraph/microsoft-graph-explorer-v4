import { makeResetStyles, tokens, makeStyles } from '@fluentui/react-components';

export const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';
export const REQUEST_HEIGHT_CSS_VAR = '--request-area-height';

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
    flexBasis: `var(${SIDEBAR_SIZE_CSS_VAR})`,
    minWidth: '48px',
    maxWidth: '50vw',
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
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
  },
  requestArea: {
    height: `var(${REQUEST_HEIGHT_CSS_VAR})`,
    minHeight: '150px',
    maxHeight: '50vh',
    position: 'relative',
    overflow: 'auto',
    flexShrink: 0,
    transition: 'height 0.2s ease-in-out',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  responseArea: {
    flex: 1,
    overflow: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  }
});