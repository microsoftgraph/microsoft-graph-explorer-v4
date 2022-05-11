import { ITheme } from '@fluentui/react';

export const mainHeaderStyles = (theme: ITheme) => {
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
        paddingLeft: '5px'
      }
    },
    feedbackIconAdjustmentStyles: {
      position: 'relative' as 'relative',
      right: '-6px',
      top: '4px'
    },
    tenantStyles: {
      height: 50,
      border: 'none',
      cursor: 'default'
    }
  }
}