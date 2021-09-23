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
      overflowY: 'auto',
      overflowX: 'auto'
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
    }
  };
};
