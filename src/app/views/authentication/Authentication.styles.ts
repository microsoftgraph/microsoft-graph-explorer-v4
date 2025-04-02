import { FontSizes, ITheme } from '@fluentui/react';

export const authenticationStyles = (theme: ITheme) => {
  return {
    authenticationLabel: {
      fontSize: FontSizes.large,
      fontWeight: 400
    },
    keyIcon: {
      margin: '0 5px'
    },
    spinner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'start',
      marginRight: theme.spacing.s1,
      padding: theme.spacing.s1,
      position: 'relative',
      top: '1px'
    },
    spinnerContainer: {
      display: 'flex',
      flexDirection: 'row'
    },
    loginProgressLabelStyles: {
      root: {
        position: 'relative',
        top: '6px'
      }
    }
  };
};
