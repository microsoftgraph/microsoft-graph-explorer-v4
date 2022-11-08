import { FontSizes, ITheme } from '@fluentui/react';

export const permissionStyles = (theme: ITheme) => {
  return {
    container: {
      padding: 10,
      maxHeight: '350px',
      minHeight: '300px',
      overflowY: 'auto',
      overflowX: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    panelContainer: {
      padding: 10,
      overflowY: 'auto' as 'auto',
      overflowX: 'auto' as 'auto'
    },
    consented: {
      fontSize: FontSizes.small,
      fontStyle: 'italic'
    },
    permissionLength: {
      fontWeight: 'bold',
      marginBottom: 5,
      paddingLeft: 10
    },
    permissionText: {
      fontSize: FontSizes.small,
      marginBottom: 5,
      paddingLeft: 10
    },
    toolTipHost: {
      root: {
        display:
          'inline-block'
      }
    },
    permissions: {
      marginBottom: 120
    },
    checkIcon: {
      fontSize: theme.fonts.large,
      color: theme.palette.accent
    },
    permissionLabel: {
      marginTop: 10,
      paddingLeft: 10,
      paddingRight: 20,
      minHeight: 200
    },
    tooltipStyles: {
      root: {
        display: 'flex',
        alignItems: 'stretch'
      }
    },
    columnCellStyles: {
      cellName: {
        overflow: 'visible !important' as 'visible',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        flex: 1,
        whiteSpace: 'normal'
      },
      cellTitle: {
        display: 'flex',
        flex: 1,
        position: 'relative' as 'relative',
        right: '4px',
        textAlign: 'center'
      }
    },
    cellTitleStyles: {
      root: {
        position: 'relative' as 'relative',
        top: '4px'
      }
    },
    detailsHeaderStyles: {
      root: {
        height: '40px',
        lineHeight: '20px',
        textAlign: 'center',
        marginTop: '7px'
      }
    }
  };
};
