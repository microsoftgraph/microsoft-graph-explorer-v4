import { makeStyles, tokens } from '@fluentui/react-components';

export const MOBILE_SIDEBAR_ID = 'mobile-sidebar-drawer';

/*
 * Sidebar scrolling: the tabs and search box stay pinned while the results below them scroll.
 * On windows at least 600px tall, only the list scrolls, so message bars and controls above it stay
 * visible as well. If the window is too short to keep the tabs and search box pinned with a usable
 * results area, the whole sidebar (or mobile drawer body) scrolls instead, so no content becomes unreachable.
 */
export const useSidebarStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
    overscrollBehaviorY: 'contain',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRightWidth: tokens.strokeWidthThin,
    borderRight: `1px solid ${tokens.colorNeutralForeground3}`
  },
  drawer: {
    backgroundColor: tokens.colorNeutralBackground2
  },
  drawerHeader: {
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    padding: tokens.spacingHorizontalS
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overscrollBehaviorY: 'contain',
    padding: tokens.spacingHorizontalS,
    paddingBottom: tokens.spacingVerticalS,
    '&:last-child': {
      paddingBottom: tokens.spacingVerticalS
    }
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',
    minWidth: 0
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',
    minWidth: 0,
    '& > hr': {
      marginLeft: 0,
      marginRight: 0
    }
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
    minHeight: '64px',
    minWidth: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  tabs: {
    flexShrink: 0
  },
  sidebarToggle: {
    marginLeft: 'auto',
    flexShrink: 0,
    padding: '10px'
  },
  tree: {
    padding: '5px',
    '@media (min-height: 600px)': {
      flex: '1 1 0',
      minHeight: 0,
      overflowY: 'auto'
    }
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  activeLeaf: {
    backgroundColor: tokens.colorNeutralBackground3Hover,
    // when selected, resource link / button visible in HCM
    '& a, & button': {
      '@media (forced-colors: active)': {
        color: 'HighlightText !important'
      }
    },
    '@media (forced-colors: active)': {
      backgroundColor: 'Highlight',
      color: 'HighlightText !important',
      forcedColorAdjust: 'none',
      // Adding border for better visibility in high contrast mode
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'ButtonText'
    }
  }
})