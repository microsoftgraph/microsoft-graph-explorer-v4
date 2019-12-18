import { FontSizes, ITheme } from '@uifabric/styling';
import { ThemeContext } from '../../../themes/theme-context';

export const authenticationStyles = (theme: ITheme) => {
  return {
    authenticationContainer: {
      justifyContent: 'space-between',
    },
    profile: {
      width: '100%',
    },
    personaText: {
      fontSize: FontSizes.mediumPlus,
      fontWeight: 600
    },
    personaSecondaryText: {
      fontSize: FontSizes.small,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textTransform: 'lowercase'
    },
    authenticationLabel: {
      fontSize: FontSizes.large,
      fontWeight: 400,
    },
    keyIcon: {
      margin: '0 5px',
    },
    spinner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'start',
      marginRight: theme.spacing.s1
    },
    spinnerContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
  };
};
