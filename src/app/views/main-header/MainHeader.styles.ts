import { ITheme } from '@fluentui/react';

export const mainHeaderStyles = (theme: ITheme, props?: any) => {
  return {
    rootStyles: {
      root: {
        background: theme.palette.neutralLighter,
        height: 50,
        marginBottom: props && props.token ? '0px' : '-9px'
      }
    },
    authenticationItemStyles: {
      alignItems: 'center',
      display: 'flex'
    }
  }
}