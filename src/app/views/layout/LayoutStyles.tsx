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
    height: '100vh'
  },
  content: {
    display: 'flex'
  },
  sidebar: {
    flex: '0 0 auto',
    flexBasis: `clamp(min(29%, var(${SIDEBAR_SIZE_CSS_VAR})), var(${SIDEBAR_SIZE_CSS_VAR}), 60%)`,
    position: 'relative',
    height: 'calc(100vh - 98px)'
  },
  mainContent: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    minHeight: '300px',
    height: 'calc(100vh - 120px)'
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
    maxHeight: '55%',
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  requestArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '37%',
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  }
});