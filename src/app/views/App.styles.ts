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
    separator: {
      borderBottom: '1px solid ' + theme.palette.neutralLight,
    },
    links: {
      color: theme.palette.blue
    },
    sidebarToggle: {
      marginBottom: theme.spacing.s1,
    },
    graphExplorerLabel: {
      fontSize: FontSizes.xLarge,
      fontWeight: 600,
    },
    graphExplorerLabelContainer: {
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  };
};
