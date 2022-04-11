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

export const navStyles: any = (properties: any) => ({
  chevronIcon: [
    properties.isExpanded && {
      transform: 'rotate(0deg)',
      position: 'relative',
      top: '-3px'
    },
    !properties.isExpanded && {
      transform: 'rotate(-90deg)',
      position: 'relative',
      top: '-3px'
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
