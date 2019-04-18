import { ITheme } from '@uifabric/styling';

export const appStyles = (theme: ITheme) => {
  return {
    app: {
        background: theme.semanticColors.bodyBackground,
        color: theme.semanticColors.bodyText,
        width: '100%',
        height: '100vh',
      },
  };
};
