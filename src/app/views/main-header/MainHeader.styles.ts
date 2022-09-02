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
    tenantIconStyles: {
      paddingRight: 3
    },
    tenantLabelStyle: {
      fontSize: FontSizes.size12,
      height: 16
    },
    tenantContainerStyle: {
      margin: '0px 10px'
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
      alignItems: 'stretch',
      height: 50,
      width: 50
    },
    helpContainerStyles: {
      height: 50,
      width: 50
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