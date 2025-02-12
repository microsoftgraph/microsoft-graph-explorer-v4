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
    display: 'flex',
    gap: tokens.spacingVerticalS
  },
  sidebar: {
    flex: '0 0 auto',
    flexBasis: `clamp(min(29%, var(${SIDEBAR_SIZE_CSS_VAR})), var(${SIDEBAR_SIZE_CSS_VAR}), 60%)`,
    position: 'relative',
    height: 'calc(100vh - 98px)'
  },
  mainContent: {
    flex: '3 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    overflowY: 'auto',
    height: 'calc(100vh - 98px)'
  },
  requestResponseArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium
  },
  responseArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    maxHeight: '45%',
    // border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  },
  requestArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    maxHeight: '50%',
    // border: `solid ${tokens.colorStrokeFocus2} ${tokens.strokeWidthThin}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalMNudge
  }
});