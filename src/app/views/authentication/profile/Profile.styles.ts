import { ITheme } from '@fluentui/react'

export const profileStyles = (theme: ITheme) => {
  return {
    linkStyles: {
      root: {
        marginRight: '50px',
        height: '24px',
        color: `${theme.palette.black} !important`,
        '&:hover': { textDecoration: 'none', color: `${theme.palette.themeDarkAlt} !important` }
      }
    },
    personaStyleToken: {
      primaryText: {
        paddingBottom: 5
      },
      secondaryText:
      {
        paddingBottom: 10,
        textTransform: 'lowercase'
      }
    },
    profileSpinnerStyles: {
      root: {
        position: 'relative' as 'relative',
        top: '2px'
      }
    }
  }
}