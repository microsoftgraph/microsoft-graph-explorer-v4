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
      },
      root: {
        height: '100%',
        paddingLeft: '3px'
      }
    },
    profileSpinnerStyles: {
      root: {
        position: 'relative' as 'relative',
        top: '2px'
      }
    },
    permissionsLabelStyles: {
      root: {
        position: 'relative' as 'relative',
        bottom: '25px',
        left: '92px',
        textDecoration: 'underline',
        color: `${theme.palette.themePrimary} !important`
      }
    },
    personaButtonStyles: {
      root: {
        ':hover': {
          background: `${theme.palette.neutralLight} !important`
        },
        height: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'stretch'
      }
    },
    profileContainerStyles: {
      display: 'flex',
      alignItems: 'stretch',
      flex: 1,
      height: '100%'
    },
    permissionPanelStyles: {
      footer: {
        backgroundColor: theme.palette.white
      },
      commands: {
        backgroundColor: theme.palette.white
      }
    },
    inactiveConsentStyles: {
      marginRight: 10,
      backgroundColor: theme.palette.themeSecondary
    },
    activeConsentStyles: {
      marginRight: 10,
      backgroundColor: theme.palette.themeDarker
    }
  }
}