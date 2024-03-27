import { ITheme } from '@fluentui/react'

export const collectionStyles = (theme: ITheme) => {
  return {
    uploadButtonStyles: {
      root: {
        '&:hover': {
          border: `1px solid ${theme.palette.themePrimary} !important`
        }
      }
    },
    uploadLabelStyles: {
      root: {
        '&:hover': {
          cursor: 'pointer'
        }
      }
    }
  }
}