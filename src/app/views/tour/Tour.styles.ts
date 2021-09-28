import { ITheme } from '@fluentui/react';

export const tourStyles = (theme: ITheme) => {
  return {
    root: {
      background: `${theme.palette.blueMid} !important`,
      color: `${theme.palette.blueMid} !important`,
      paddingTop: theme.spacing.s1
    }
  };
}