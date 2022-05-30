import { FontSizes, FontWeights, ITheme } from '@fluentui/react';

export const mainHeaderStyles = (theme: ITheme, mobileScreen?: boolean) => {
  return {
    rootStyles: {
      root: {
        background: theme.palette.neutralLighter,
        height: 50,
        marginBottom: '9px'
      }
    },
    rightItemsStyles: {
      root: {
        alignItems: 'center',
        flexBasis: mobileScreen ? '137px' : ''
      }
    },
    feedbackIconAdjustmentStyles: {
      position: 'relative' as 'relative',
      top: '4px'
    },
    tenantStyles: {
      height: 50,
      border: 'none',
      cursor: 'default',
      background: theme.palette.neutralLighter
    },
    iconButton: {
      menuIcon: { fontSize: 15 },
      root: {
        height: '50px',
        width: '50px',
        ':hover': {
          background: `${theme.palette.neutralLight} !important`
        },
        flexGrow: '1'
      }
    },
    moreInformationStyles: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '60px'
    },
    settingsContainerStyles: {
      display: 'flex',
      alignItems: 'stretch'
    },
    tooltipStyles: {
      root: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'stretch'
      }
    },
    graphExplorerLabelStyles: {
      fontSize: mobileScreen ? FontSizes.medium : FontSizes.xLarge,
      fontWeight: FontWeights.semibold,
      position: mobileScreen ? 'relative' as 'relative' : 'static' as 'static',
      top: '3px'
    }
  }
}