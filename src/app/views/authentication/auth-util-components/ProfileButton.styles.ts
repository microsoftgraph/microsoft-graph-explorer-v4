import { ITheme } from '@fluentui/react'

export const profileButtonStyles = (theme: ITheme) => {
  return {
    actionButtonStyles: {
      root: {
        height: 50,
        width: 50,
        ':hover': {
          background: `${theme.palette.neutralLight} !important`
        }
      },
      icon: {
        flex: 1
      }
    }
  }
}