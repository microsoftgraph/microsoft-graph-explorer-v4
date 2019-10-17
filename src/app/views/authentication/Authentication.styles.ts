import { FontSizes, ITheme } from '@uifabric/styling';

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
      fontSize: FontSizes.medium
    },
  };
};
