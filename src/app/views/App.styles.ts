import { ITheme } from '@uifabric/styling';
import { inherits } from 'util';

export const appStyles = (theme: ITheme) => {
  return {
    app: {
      background: theme.semanticColors.bodyBackground,
      color: theme.semanticColors.bodyText,
      paddingTop: theme.spacing.s1,
      width: '100%',
      height: '1024px',
      overflow: 'scroll'
    },
    tryItMessage: {
      marginBottom: theme.spacing.s1
    },
    sidebar: {
      borderRight: 'solid 1px ' + theme.palette.neutralLighter
    },
    links: {
      color: 'inherit'
    },
    sidebarToggle: {
      marginBottom: theme.spacing.s1,
    },
  };
};
