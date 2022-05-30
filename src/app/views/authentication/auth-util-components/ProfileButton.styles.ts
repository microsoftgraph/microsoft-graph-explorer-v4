import { ITheme } from '@fluentui/react'

export const profileButtonStyles = (theme: ITheme) => {
  return {
    actionButtonStyles: {
      root: {
        height: 50,
        width: 80,
        ':hover': {
          background: `${theme.palette.neutralLight} !important`
        },
        whiteSpace: 'nowrap',
        paddingLeft: '10px',
        flexBasis: '60px'
      }
    }
  }
}