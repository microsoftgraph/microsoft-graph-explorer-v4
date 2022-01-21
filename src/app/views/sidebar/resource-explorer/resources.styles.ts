import { ITheme } from '@fluentui/react'

export const resourceExplorerStyles = (theme: ITheme) => {
  return {
    itemStyles: {
      root: {
        border: '1px solid',
        borderColor: theme.palette.themePrimary,
        marginLeft: '-15px'
      }
    },
    commandBarStyles: {
      root: {
        backgroundColor: theme.palette.neutralLighter
      }
    }
  }
}