import { ITheme } from '@fluentui/react'

export const getSnippetStyles = (theme: ITheme) => {
  return {
    root: {
      color: theme.palette.green
    },
    snippetComments: {
      color: theme.palette.green,
      marginLeft: '28px',
      fontFamily: 'Consolas,"Courier new", monospace',
      fontSize: '14px',
      lineHeight: '1.5'
    }
  }
}