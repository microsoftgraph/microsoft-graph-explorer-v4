import { makeResetStyles, tokens, makeStyles } from '@fluentui/react-components';

export const SIDEBAR_SIZE_CSS_VAR = '--sidebar-size';

export const useLayoutResizeStyles = makeResetStyles({
  [SIDEBAR_SIZE_CSS_VAR]: '29%'
})

export const useLayoutStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingHorizontalS,
    height: '100vh',
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
    flexBasis: `clamp(48px, var(${SIDEBAR_SIZE_CSS_VAR}), 50vw)`,
    maxWidth: '50vw',
    minWidth: '48px',
    position: 'relative',
    height: 'calc(100vh - 98px)',
    overflow: 'hidden',
    transition: 'flex-basis 0.2s ease-in-out'
  },
  mainContent: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    height: 'calc(100vh - 120px)',
    overflow: 'hidden'
  },
  requestResponseArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden'
  },
  responseArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '60%',
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  requestArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '40%',
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  }
});