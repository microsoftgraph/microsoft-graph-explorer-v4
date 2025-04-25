import { makeStyles, tokens } from '@fluentui/react-components';

export const useSidebarStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRightWidth: tokens.strokeWidthThin,
    borderRight: `1px solid ${tokens.colorNeutralForeground3}`,
    '@media (max-width: 768px)': {
      height: '100%',
      minHeight: '100%'
    }
  },
  sidebarToggle: {
    marginLeft: 'auto',
    padding: '10px'
  },
  tree: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '5px',
    maxHeight: 'calc(100vh - 400px)'
  },
  searchBox: {
    width: '100%',
    maxWidth: '100%'
  },
  activeLeaf: {
    backgroundColor: tokens.colorNeutralBackground3Hover,
    '@media (forced-colors: active)': {
      backgroundColor: 'Highlight',
      color: 'HighlightText',
      forcedColorAdjust: 'none',
      // Adding border for better visibility in high contrast mode
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'ButtonText'
    }
  }
})