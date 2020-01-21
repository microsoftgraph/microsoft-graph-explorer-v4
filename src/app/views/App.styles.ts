import { FontSizes, ITheme } from '@uifabric/styling';

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
    },
    sidebarMini: {
      background: theme.palette.neutralLighter,
      maxWidth: '65px',
      minWidth: '55px',
    },
    layoutExtra: {
      minWidth: '95%',
      maxWidth: '96%',
    },
    separator: {
      borderBottom: '1px solid ' + theme.palette.neutralLight,
    },
    links: {
      color: theme.palette.blueMid
    },
    sidebarToggle: {
      marginBottom: theme.spacing.s1,
      marginTop: theme.spacing.s1,
    },
    previewButton: {
      marginTop: theme.spacing.s1,
    },
    graphExplorerLabel: {
      fontSize: FontSizes.xLarge,
      fontWeight: 600,
    },
    graphExplorerLabelContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 500
    }
  };
};
