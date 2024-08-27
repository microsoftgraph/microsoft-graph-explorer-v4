import { makeStyles, tokens } from '@fluentui/react-components';

export const useLayoutStyles = makeStyles({
  app: {
    background: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    paddingTop: tokens.spacingVerticalS,
    height: '100%',
    paddingRight: '15px',
    paddingLeft: '4px',
    paddingBottom: '5px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  appRow: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'stretch'
  },
  tryItMessage: {
    marginBottom: tokens.spacingVerticalS
  },
  sidebar: {
    background: tokens.colorNeutralBackground2,
    paddingRight: '10',
    paddingLeft: '10',
    marginRight: '10',
    marginBottom: '9',
    color: tokens.colorNeutralForeground1
  },
  sidebarMini: {
    background: tokens.colorNeutralBackground2,
    maxWidth: '65px',
    minWidth: '55px',
    padding: '10',
    marginBottom: '9',
    color: tokens.colorNeutralForeground1

  },
  layoutExtra: {
    minWidth: '95%',
    maxWidth: '96%'
  },
  separator: {
    borderBottom: '1px solid ' + tokens.colorNeutralForeground2
  },
  sidebarToggle: {
    marginBottom: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalS
  },
  previewButton: {
    marginTop: tokens.spacingVerticalS
  },
  graphExplorerLabel: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600
  },
  graphExplorerLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '500'
  },
  versionLabel: {
    color: tokens.colorNeutralForeground1,
    fontSize: '10px',
    paddingLeft: '3',
    paddingTop: '5'
  },
  statusAreaMobileScreen: {
    marginTop: '5'
  },
  statusAreaFullScreen: {
    marginTop: '6',
    position: 'relative',
    bottom: 0
  },
  vResizeHandle: {
    zIndex: 1,
    borderRight: '1px solid silver',
    '&:hover': {
      borderRight: '3px solid silver'
    }
  },
  feedbackButtonFullScreenDisplay: {
    position: 'relative',
    top: '5px'
  },
  feedbackButtonMobileDisplay: {
    position: 'absolute',
    top: '13px',
    right: '10px'
  }
});
