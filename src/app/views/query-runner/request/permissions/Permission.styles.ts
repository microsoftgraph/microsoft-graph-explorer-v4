import { FontSizes, ITheme } from '@uifabric/styling';

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
    consented: {
      fontSize: FontSizes.small,
      fontStyle: 'italic'
    },
    permissionLength: {
      fontWeight: 'bold',
      marginBottom: 5
    },
    permissionText: {
      fontSize: FontSizes.small,
      marginBottom: 5
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
    }
  };
};
