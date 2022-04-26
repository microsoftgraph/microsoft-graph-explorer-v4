import { ITheme } from '@fluentui/react';

export const mainHeaderStyles = (theme: ITheme) => {
  return {
    rootStyles: {
      root: {
        background: theme.semanticColors.bodyBackground,
        height: 50,
        marginBottom: '-9px'
      }
    },
    authenticationItemStyles: {
      alignItems: 'center',
      display: 'flex'
    }
  }
}