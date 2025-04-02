import { ITheme } from '@fluentui/react'

export const resourceExplorerStyles = (theme: ITheme) => {
  return {
    apiCollectionButton: {
      root: {
        width: '100%',
        padding: '8px 12px',
        border: `1px solid ${theme.palette.neutralLight}`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.palette.white,
        textAlign: 'left',
        height: '40px',
        marginTop: '10px'
      },
      label: {
        marginLeft: '8px',
        fontWeight: 'bold',
        color: theme.palette.neutralPrimary,
        fontSize: '14px'
      }
    },
    apiCollectionCount: {
      fontSize: '14px',
      color: theme.palette.black
    }
  }
}

export const navStyles: any = (properties: any) => ({
  chevronIcon: [
    properties.isExpanded && {
      transform: 'rotate(0deg)',
      position: 'relative'
    },
    !properties.isExpanded && {
      transform: 'rotate(-90deg)',
      position: 'relative'
    }
  ],
  chevronButton: [
    properties.isExpanded && {
      selectors: {
        '::after': {
          borderStyle: 'none !important',
          borderLeft: '0px !important'
        }
      }
    },
    !properties.isExpanded && {
      selectors: {
        '::after': {
          borderStyle: 'none !important',
          borderLeft: '0px !important'
        }
      }
    }
  ],
  link: [
    properties.isSelected && {
      selectors: {
        '::after': {
          borderStyle: 'none !important',
          borderLeft: '0px !important'
        }
      }
    }
  ]
});
