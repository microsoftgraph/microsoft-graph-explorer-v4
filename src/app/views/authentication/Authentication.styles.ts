import { FontSizes, ITheme } from '@uifabric/styling';

export const authenticationStyles = (theme: ITheme) => {
  return {
    authenticationContainer: {
      justifyContent: 'space-between',
    },
    signInButton: {
      textTransform: 'capitalize',
    },
    profile: {
      width: '100%',
    },
    personaText: {
      fontSize: FontSizes.mediumPlus,
      fontWeight: 600
    },
    personaSecondaryText: {
      fontSize: FontSizes.medium
    },
  };
};
