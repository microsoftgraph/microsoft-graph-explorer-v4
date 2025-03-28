import { makeResetStyles, tokens, makeStyles } from '@fluentui/react-components';

export const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

export const useLayoutResizeStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '23%'
})

export const useLayoutStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalS,
    height: 'clamp(100vh, auto, 200vh)',
    overflow: 'hidden'
  },
  content: {
    display: 'flex',
    flex: 1,
    overflowY: 'hidden',
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
    minWidth: '300px',
    minHeight: 'calc(100vh - 98px)',
    overflow: 'hidden'
  },
  requestResponseArea: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '60vh',
    minHeight: '550px',
    overflow: 'hidden'
  },
  responseArea: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '300px',
    height: 'auto',
    maxHeight: '100%',
    overflow: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  requestArea: {
    flex: '1 1 40%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
    height:'auto',
    maxHeight: '40%',
    overflow: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  }
});