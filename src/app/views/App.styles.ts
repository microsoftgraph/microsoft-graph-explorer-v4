import { FontSizes, ITheme } from '@fluentui/react';

export const appStyles = (theme: ITheme) => {
  return {
    app: {
      background: theme.semanticColors.bodyBackground,
      color: theme.semanticColors.bodyText,
      paddingTop: theme.spacing.s1,
      width: '100%'
    },
    tryItMessage: {
      marginBottom: theme.spacing.s1
    },
    sidebar: {
      background: theme.palette.neutralLighter,
      paddingLeft: 10
    },
    sidebarMini: {
      background: theme.palette.neutralLighter,
      maxWidth: '65px',
      minWidth: '55px',
      padding: 10
    },
    layoutExtra: {
      minWidth: '95%',
      maxWidth: '96%'
    },
    separator: {
      borderBottom: '1px solid ' + theme.palette.neutralLight
    },
    links: {
      color: `${theme.palette.blueMid} !important`
    },
    sidebarToggle: {
      marginBottom: theme.spacing.s1,
      marginTop: theme.spacing.s1
    },
    previewButton: {
      marginTop: theme.spacing.s1
    },
    graphExplorerLabel: {
      fontSize: FontSizes.xLarge,
      fontWeight: 600
    },
    graphExplorerLabelContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 500
    },
    versionLabel: {
      color: theme.palette.neutralSecondary,
      fontSize: '10px',
      paddingLeft: 3,
      paddingTop: 5
    },
    statusAreaMobileScreen: {
      marginTop: 5
    },
    statusAreaLaptopScreen: {
      marginTop: 0
    },
    vResizeHandle: {
      zIndex: 1,
      borderRight: '1px solid silver',
      '&:hover': {
        borderRight: '3px solid silver'
      }
    }
  };
};
