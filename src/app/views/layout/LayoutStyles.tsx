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
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: tokens.spacingHorizontalS
  },
  fixedSection: {
    flexShrink: 0
  },
  workspaceSection: {
    flexShrink: 0,
    margin: '0 10px'
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    minWidth: 0,
    minHeight: 0
  },
  sidebar: {
    flex: '0 0 auto',
    flexBasis: `var(${SIDEBAR_SIZE_CSS_VAR})`,
    minWidth: '48px',
    maxWidth: '50vw',
    position: 'relative',
    overflow: 'hidden',
    transition: 'flex-basis 0.2s ease-in-out'
  },
  mobileSidebar: {
    display: 'contents'
  },
  hiddenSidebar: {
    display: 'none'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    minWidth: 0,
    minHeight: 0
  },
  requestResponseArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto'
  },
  requestArea: {
    boxSizing: 'border-box',
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
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 240px',
    minHeight: '240px',
    minWidth: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS
  },
  headerMessaging: {
    flexShrink: 0,
    margin: '10px'
  }
});